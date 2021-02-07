import { Avatar, Box, Button, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { CommentType, CommentWithParent, User } from '../../constants/types'
import MDEditor from '@uiw/react-md-editor'
import { getTimeDifference } from '../../services/date'

export interface CommentCardProps {
  comment: CommentWithParent
  by: User
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, by }) => {
  const handleReply = () => {}
  console.log({ comment })
  const { num, off } = getTimeDifference(comment.createdate)
  let dateString = `${num} ${off} ago`
  if (num === 0) {
    dateString = 'Now'
  }
  return (
    <Box key={comment.id} borderWidth={0} p={5} boxShadow='none'>
      <Stack direction='column'>
        <Stack direction='row' alignItems='center'>
          <Avatar src={by.avatar} size='sm' />
          <Box>
            <Text>{by.name}</Text>
            <Text fontSize='sm'>{dateString}</Text>
          </Box>
        </Stack>
        <MDEditor.Markdown source={comment.markdownText} />
        <Box
          variant='ghost'
          onClick={handleReply}
          fontSize='sm'
          fontWeight='bold'
          color='GrayText'
          textStyle='link'
          _hover={{
              cursor: "pointer"
          }}
        >
          Reply
        </Box>
      </Stack>
    </Box>
  )
}

export default CommentCard
