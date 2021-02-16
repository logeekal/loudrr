import { Avatar, Box, Button, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { CommentWithParent, User } from '../../constants/types'
import MDEditor from '@uiw/react-md-editor'
import { getTimeDifference } from '../../services/date'
import CommentBox from '../CommentBox'

export interface CommentCardProps {
  comment: CommentWithParent
  by: User
  childrenHandler: any,
  level:number
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  by,
  childrenHandler,
  level
}) => {
  if(level > 0)
  {

  console.log({comment})
  debugger;
  }
  const [editingMode, setEditingMode] = useState(false)
  const handleReply = () => {
    setEditingMode(true)
  }
  const { num, off } = getTimeDifference(comment.createDate)
  let dateString = `${num} ${off} ago`
  if (num === 0) {
    dateString = 'Now'
  }

  const commentSubmitHandler = () => {
    if(comment.id){
      setEditingMode(false);
    }
  }

  return (
    <Box key={comment.id} borderWidth={0} p={5} boxShadow='none'>
      <Stack direction='column' marginInlineStart={level*10}>
        <Stack direction='row' alignItems='center'>
          <Avatar src={by.avatar} size='sm' />
          <Box>
            <Text>{by.name}</Text>
            <Text fontSize='sm'>{dateString}</Text>
          </Box>
        </Stack>
        <MDEditor.Markdown source={unescape(comment.markdownText)} />
        <Stack
          direction='row'
          fontSize='sm'
          fontWeight='bold'
          color='GrayText'
          textStyle='link'
        >
          <Box
            variant='ghost'
            onClick={handleReply}
            _hover={{
              cursor: 'pointer'
            }}
          >
            Reply
          </Box>
          <Box _hover={{ cursor: 'pointer' }} onClick={childrenHandler}>
            {comment.replyCount > 0 && `${comment.replyCount} replies`}{' '}
          </Box>
          </Stack>
        {editingMode && <CommentBox replyOf={comment.id} onSubmit={commentSubmitHandler} />}
          
      </Stack>
    </Box>)
}

export default CommentCard
