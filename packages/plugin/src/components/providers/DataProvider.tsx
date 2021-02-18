import { useToast } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { CommentWithParent, User } from '../../constants/types'
import APIService from '../../services/API'

export interface DataContextProps {
  comments: {
    add: (
      parentCommentId: string | null,
      mdText: string,
      commentStatus: string
    ) => Promise<void>
    loadParents: () => Promise<void>
    loadChildren: (parentCommentId: string) => Promise<void>
    thread: Thread
    parentComments: string[]
  }
  user: {
    loggedinUser: User | undefined
    setLoggedinUser: (user: User) => void
    users: UsersObjType,
    checkAuth: () => Promise<void>
  }
}

export interface DataProviderProps {
  domainKey: string
  authenticatedUser: User
}

export const DataContext = React.createContext<DataContextProps | null>(null)

interface Thread {
  [commentId: string]: CommentWithParent
}

interface UsersObjType {
  [id: string]: User
}
interface CommentData {
  thread: Thread
  users: UsersObjType
  parentComments: string[]
}

const DataProvider: FC<DataProviderProps> = ({
  children,
  domainKey,
  authenticatedUser
}) => {
  const [commentData, setCommentData] = useState<CommentData>({
    thread: {},
    parentComments: [],
    users: {}
  })

  const [loggedinUser, setLoggedinUser] = useState<User>()

  const toast = useToast()

  useEffect(()=>{
    checkAuth().then()
  },[])

  useEffect(() => {
    setLoggedinUser(authenticatedUser)

    //add logged in user to the user dictionary for reference
  }, [authenticatedUser])

  useEffect(() => {
    if (loggedinUser) {
      setCommentData({
        ...commentData,
        users: {
          ...commentData.users,
          [loggedinUser.id]: loggedinUser
        }
      })
    }
  }, [loggedinUser])

  useEffect(() => {
    // Load Parent comments.
    // Load Authenticated User.
    loadAllParentComments().then(() =>
      console.log('All Parent Commits loaded.')
    )
  }, [domainKey])

  const addNewComment = async (
    parentCommentId: string | null,
    mdText: string,
    commentStatus: string
  ) => {
    try {
      console.log(
        'Adding new comment with args ',
        parentCommentId,
        mdText,
        commentStatus
      )
      const createdCommentResponse = await APIService.createComment(
        parentCommentId,
        mdText as string,
        commentStatus,
        window.location.href,
        window.document.title,
        domainKey
      )

      console.log('Comment created.. Now toasting')

      toast({
        title: 'Comment Posted',
        description: 'You comment has been successfully posted',
        status: 'success'
      })

      console.log('toasted', createdCommentResponse)

      const createdComment = createdCommentResponse.data
      console.log(JSON.stringify(createdComment))
      const newParentCommentIds = !parentCommentId
        ? [createdComment.id].concat([...commentData.parentComments])
        : [...commentData.parentComments]
      const commentedBy = loggedinUser ? loggedinUser.id : ''

      let newParentComment: Thread = {}
      if (parentCommentId) {
        console.log({
          replies_orig: commentData.thread[parentCommentId].replies
        })
        console.log([createdComment.id])
        newParentComment[parentCommentId] = {
          ...commentData.thread[parentCommentId],
          replies: [createdComment.id].concat(
            commentData.thread[parentCommentId].replies || []
          ),
          replyCount: commentData.thread[parentCommentId].replyCount + 1
        }
      }

      console.log('setting state', newParentComment)
      setCommentData({
        thread: {
          ...commentData.thread,
          [createdComment.id]: {
            ...createdComment,
            replyCount: 0,
            replies: [],
            by: commentedBy,
            parentCommentId: parentCommentId
          },
          //update the replies of parent Comment.
          ...newParentComment
        },
        users: { ...commentData.users },
        parentComments: [...newParentCommentIds]
      })
    } catch (err) {
      console.log(err)
      toast({
        title: 'Some Error Occured',
        description: 'Check console for details',
        status: 'error'
      })
    }
  }

  const loadAllParentComments = async () => {
    try {
      const allPagesResp = await APIService.getDomainPages(domainKey, {})
      const allPages = allPagesResp.data
      const { page, comment, commentedBy, replyCount } = allPages
      console.log(page)
      const newThread: Thread = {}
      const newUsers: UsersObjType = {}
      page.forEach((singlePage, index) => {
        if (singlePage.pageLocation === window.location.href) {
          const selectedComment = comment[index]
          newThread[selectedComment.id] = {
            ...selectedComment,
            parentCommentId: null,
            markdownText: unescape(selectedComment.markdownText),
            by: commentedBy[index].id,
            replies: [],
            replyCount: replyCount[index]
          }
          const selectedUser = commentedBy[index]
          newUsers[selectedUser.id] = selectedUser
        }
      })
      console.log({ newUsers })
      setCommentData({
        thread: { ...commentData.thread, ...newThread },
        parentComments: comment.map((comment) => comment.id),
        users: { ...commentData.users, ...newUsers }
      })
    } catch (error) {
      throw error
    }
  }

  const loadChildren = async (parentCommentId: string) => {
    try {
      const childrenResponse = await APIService.getCompleteThread(
        parentCommentId
      )

      const { comment, parentId, by, replyCount } = childrenResponse.data

      const newThread: Thread = {}
      const newUsers: UsersObjType = {}

      let replyIds: string[] = comment
        .filter((currcomment) => !(currcomment.id in commentData.thread))
        .map((currentComment, index) => {
          //insert only if not already present
          newThread[currentComment.id] = {
            ...currentComment,
            parentCommentId: parentId[index],
            replyCount: replyCount[index],
            replies: [],
            by: by[index].id
          }

          //insert all parents in the newThread as well.
          if (parentId[index] in commentData.thread) {
            //else the parentId is newly fetched and is already in newThread
            newThread[parentId[index]] = {
              ...commentData.thread[parentId[index]]
            }
          }

          newUsers[by[index].id] = by[index]
          return currentComment.id
        })

      replyIds.forEach((replyId) => {
        //get parent of the reply

        console.log(`Finding parent id or reply Id ${replyId}`)

        const parentId = newThread[replyId].parentCommentId
        if (parentId) {
        const newReplies = [...newThread[parentId].replies, replyId]
          newThread[parentId] = {
            ...newThread[parentId],
            replies: newReplies.sort((a,b)=> newThread[b].updateDate - newThread[a].updateDate),
          }
        }
      })

      setCommentData({
        thread: {
          ...commentData.thread,
          ...newThread
        },
        users: {
          ...commentData.users,
          ...newUsers
        },
        parentComments: [...commentData.parentComments]
      })
    } catch (err) {
      throw err
    }
  }

  const checkAuth = async () => {
    console.log('checking auth')
    APIService.auth()
      .then((res) => {
        console.log(res.data)
        console.log(`setting login data`);
        
        setLoggedinUser(res.data)
      })
      .catch((err) => {
        console.error(err)
      })

  }

  return (
    <DataContext.Provider
      value={{
        comments: {
          add: addNewComment,
          loadParents: loadAllParentComments,
          loadChildren,
          thread: commentData.thread,
          parentComments: commentData.parentComments
        },
        user: { loggedinUser, setLoggedinUser, users: commentData.users, checkAuth }
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider
