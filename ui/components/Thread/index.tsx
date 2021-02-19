import React, { FC, ReactNode, useContext, useEffect, useState } from 'react'
import { Box, Divider, Flex, Spinner, Stack } from '@chakra-ui/react'
// import CommentBox from '../CommentBox'
import CommentCard from '../CommentCard'
import { CommentWithParent, User } from '../../utils/types'
import { DataContext, DataContextProps } from '../providers/DataProvider'
import { REQUEST_STATES } from '../../utils/constants'

export interface ThreadProps {
  domainKey: string,
  parentComments: Array<string>
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

const Thread: FC<ThreadProps> = ({ domainKey, parentComments }) => {
  const {
    comments: {
      loadParents: loadAllParentComments,
      loadChildren,
      thread,
    },
    user: { users }
  } = useContext<DataContextProps>(DataContext)

  const [threadLoadState, setThreadLoadState] = useState(REQUEST_STATES.IDLE) 

  useEffect(() => {
    loadAllParentComments().then(() => console.log(' Initial Comments loaded'))
  }, [])

  const loadThread = (
    currentList: string[],
    level: number
  ): ReactNode[] => {
    return currentList.map( (commentId) => {
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
          childrenHandler={async () => {
            setThreadLoadState(REQUEST_STATES.PENDING)
            await loadChildren(commentId)
            setThreadLoadState(REQUEST_STATES.IDLE)
          }}
          level={level}
        >
          {  
           currentComment.replies.length > 0 && [
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
       console.log(result)
      return result
    })
  }

  const getTotalCount = () => {
    return parentComments.reduce((prev, next)=>{
      return prev + thread[next].replyCount
    },0)
  }


  return (
    <Box className='thread'>

      <Stack m={10} direction='column'>
        <Box>{getTotalCount() + " Comments" }</Box>
        <Divider mb={"2"}/>
        {/* <CommentBox onSubmit={()=>{}}/> */}
        <Stack className='comments' direction='column'>
          {loadThread(parentComments, 0)}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Thread
