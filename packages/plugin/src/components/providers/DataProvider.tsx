import { StatHelpText } from '@chakra-ui/react'
import { VisibilityAction } from 'framer-motion'
import React, { FC, ReactNode, useEffect, useState } from 'react'
import APIService from '../../services/API'

export interface DataContextProps {}

const DataContext = React.createContext<DataContextProps>()

const DataProvider: FC<DataContextProps> = ({ children }) => {

  const [domainKey, setDomainKey] = useState('');

  useEffect(()=> {

  },[domainKey])

  const addNewComment = async (
    parentCommentId: string,
    mdText: string,
    commentStatus: string
  ) => {
    const createdComment = await APIService.createComment(
      parentCommentId,
      mdText as string,
      commentStatus,
      window.location.href,
      window.document.title,
      domainKey
    )

    toast({
      title: 'Comment Saved as draft',
      description: 'You comment has been successfully posted',
      status: 'success'
    })

    onSubmit(createdComment.data)
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
            by: commentedBy[index].email,
            replyCount: replyCount[index]
          }
          const selectedUser = commentedBy[index]
          newUsers[selectedUser.email] = selectedUser
        }
      })
      console.log({ newUsers })
      setCommentData({
        thread: {...commentData.thread, ...newThread},
        users: {...commentData.users, ...newUsers}
      })
    } catch (error) {
      throw error
    }
  }

  const [commentData, setCommentData] = useState<CommentData>({
      thread: {},
      users: {}
  });

  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>
}

interface Thread {
  [commentId: string]: CommentWithParent
}

interface UsersObjType {
  [userId: string]: User
}
interface CommentData {
  thread: Thread
  users: UsersObjType
}

interface ReducerAction {
  type: string
  payload: any
}

const initialState: CommentData = {
  thread: {},
  users: {}
}

