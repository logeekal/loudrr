import React, { FC, ReactNode, useContext, useEffect, useState } from 'react'
import { Box, Divider, Stack } from '@chakra-ui/react'
import CommentBox from '../CommentBox'
import CommentCard from '../CommentCard'
import { CommentWithParent, User } from '../../constants/types'
import { DataContext, DataContextProps } from '../providers/DataProvider'
import { REQUEST_STATES } from '../../constants'

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

const Thread: FC<ThreadProps> = () => {
  const {
    comments: {
      loadParents: loadAllParentComments,
      loadChildren,
      thread,
      parentComments
    },
    user: { users }
  } = useContext<DataContextProps>(DataContext)

  const [threadLoadState, setThreadLoadState] = useState(REQUEST_STATES.IDLE)
  console.log({thread})

  useEffect(() => {
    setThreadLoadState(REQUEST_STATES.PENDING)
    loadAllParentComments().then(() => {
      console.log(' Initial Comments loaded ' + threadLoadState)
      setThreadLoadState(REQUEST_STATES.SUCCESS)
    })
  }, [])

  const loadThread = (currentList: string[], level: number): ReactNode[] => {
    // console.log(currentList)
    return currentList.map((commentId) => {
      // console.log(`Looking for ${commentId} in `, thread)
      let currentComment = thread[commentId]
      // if (level > 0) {
      //   // console.log(currentComment, 'for comment id ', commentId)
      // }
      const commentedBy = currentComment && users[currentComment.by]
      let result: ReactNode[] = []

      result.push(
        <CommentCard
          comment={currentComment}
          by={commentedBy}
          childrenHandler={async () => {
            setThreadLoadState(REQUEST_STATES.PENDING)
            await loadChildren(commentId)
            setThreadLoadState(REQUEST_STATES.IDLE)
          }}
          level={level}
        >
          {currentComment.replies.length > 0 && [
            ...loadThread([...currentComment.replies], level + 1)
          ]}
        </CommentCard>
      )
      // if (currentComment.replies.length > 0) {
      //   result = [
      //     ...result,
      //     ...(await loadThread([...currentComment.replies], level + 1))
      //   ]
      // }
      //  console.log(result)
      return result
    })
  }

  const getTotalCount = () => {
    if(Object.keys(thread).length === 0){
      return 0;
    }
    return parentComments.reduce((prev, next) => {
      return prev + thread[next].replyCount
    }, 0)
  }

  return (
    <Box className='thread'>
      <Stack m={10} direction='column'>
        <Box>{getTotalCount() + ' Comments'}</Box>
        <Divider mb={'2'} />
        <CommentBox onSubmit={() => {}} />
        <Stack className='comments' direction='column'>
          {loadThread(parentComments, 0)}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Thread
