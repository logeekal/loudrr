import React, { FC, useEffect, useState } from 'react'
import { Box, Flex, Stack } from '@chakra-ui/react'
import APIService, { CommentType } from '../../services/API'
import CommentBox from '../CommentBox'
import CommentCard from '../CommentCard'
import { CommentWithParent, User } from '../../constants/types'

export interface ThreadProps {
  domainKey: string
}

export interface Thread {
  [commentId: string]: CommentWithParent
}

export interface UsersObjType {
  [userId: string]: User
}
export interface CommentData {
  thread: Thread,
  users: UsersObjType
}

const Thread: FC<ThreadProps> = ({ domainKey }) => {
  const [thread, setThread] = useState<Thread>()
  const [users, setUsers] = useState<UsersObjType>()
  const [commentData, setCommentData] = useState<CommentData>({
    thread: {},
    users: {}
  });
  console.log(thread)
  console.log(users)

  const handleNewComment = (comment: CommentType) => {
    const commentObj: Thread = {
      [comment.id]: {
        ...comment,
        parentCommentId: null,
        markdownText: unescape(comment.markdownText)
      }
    }
    console.log('Adding new comment to thread ', comment)

    setThread({ ...thread, ...commentObj })
  }
  useEffect(() => {
    loadAllParentComments().then(() => console.log(' Initial Comments loaded'))
  }, [])

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

  return (
    <Box className='thread'>
      <Stack m={10} direction='column'>
        <CommentBox domainKey={domainKey} onSubmit={handleNewComment} />
        <Stack className='comments' direction='column'>
          {Object.values(commentData.thread || {}).map((comment) => {
            if ('parentCommentId' in comment || !comment.parentCommentId) {
              return (
                <CommentCard
                  comment={comment}
                  by={commentData.users[comment.by]}
                />
              )
            }
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Thread
