import React, { FC, ReactNode, useContext, useEffect, useState } from 'react'
import { Box, Flex, Stack } from '@chakra-ui/react'
import APIService, { CommentType } from '../../services/API'
import CommentBox from '../CommentBox'
import CommentCard from '../CommentCard'
import { CommentWithParent, User } from '../../constants/types'
import { DataContext, DataContextProps } from '../providers/DataProvider'

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
  thread: Thread
  users: UsersObjType
}

const Thread: FC<ThreadProps> = ({ domainKey }) => {
  const {
    comments: {
      loadParents: loadAllParentComments,
      loadChildren,
      thread,
      parentComments
    },
    user: { users }
  } = useContext<DataContextProps>(DataContext)

  useEffect(() => {
    loadAllParentComments().then(() => console.log(' Initial Comments loaded'))
  }, [])

  const loadThread = (currentList: string[], level: number): ReactNode[] => {
    return currentList.map((commentId) => {
      let currentComment = thread[commentId]
      if (level > 0) {
        console.log(currentComment, 'for comment id ', commentId)
      }
      const commentedBy = currentComment && users[currentComment.by]
      let result: ReactNode[] = []
      result.push(
        <CommentCard
          comment={currentComment}
          by={commentedBy}
          childrenHandler={async () => await loadChildren(commentId)}
          level={level}
        />
      )
      if (currentComment.replies.length > 0) {
        //print current comment.
        //switch to child its child
        result = [
          ...result,
          ...loadThread([...currentComment.replies], level + 1)
        ]
      }
      console.log(result)
      return result
    })
  }

  return (
    <Box className='thread'>
      <Stack m={10} direction='column'>
        <CommentBox />
        <Stack className='comments' direction='column'>
          {loadThread(parentComments, 0)}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Thread
