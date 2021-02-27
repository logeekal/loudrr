import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  Text
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { CommentWithParent, User } from '../../constants/types'
import MDEditor from '@uiw/react-md-editor'
import { getTimeDifference } from '../../services/date'
import CommentBox from '../CommentBox'

export interface CommentCardProps {
  comment: CommentWithParent
  by: User
  childrenHandler: any
  level: number
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  children,
  by,
  childrenHandler,
  level
}) => {
  if (level > 0) {
    // console.log({ comment })
    // debugger
  }
  const [editingMode, setEditingMode] = useState(false)
  const [childrenLoaded, setChildrendLoaded] =  useState(level !== 0);

  const [childrenVisibleToggle, setChildrenVisibleToggle] = useState(level !==0);

  const expandReplies = async () => {

    if(!childrenLoaded && comment.replyCount > 0){
      await childrenHandler();
    }
    setChildrendLoaded(true)
    setChildrenVisibleToggle(!childrenVisibleToggle)
  }

  const handleReply = () => {
    setEditingMode(!editingMode)
  }

  const { num, off } = getTimeDifference(comment.createDate)
  let dateString = `${num} ${off} ago`
  if (num === 0) {
    dateString = 'Now'
  }

  const commentSubmitHandler = async() => {
    await expandReplies()
    if (comment.id) {
      setEditingMode(false)
    }
    setChildrenVisibleToggle(true)
  }

  return (
    <Box key={comment.id}>
        {level > 0 && <Divider marginBlockStart={2}/>}
      <Stack
        className={`level-${level}`}
        direction='column'
        marginInlineStart={`${level * 0.5}rem`}
        borderWidth={level === 0 ? 1 : 0}
        borderRadius={10}
        p={5}
        paddingBlockEnd={childrenVisibleToggle && comment.replyCount > 0 ? 0 : 5}
        boxShadow={level === 0 ? 'sm' : 'none'}
      >
        <Stack direction='row' alignItems='center' fontSize="smaller" fontWeight="semibold">
          <Avatar src={by.avatar} size='sm' />
          <Box>
            <Text >{by.name}</Text>
            <Text color="gray.500">{dateString}</Text>
          </Box>
        </Stack>
        <MDEditor.Markdown source={unescape(comment.markdownText)} />
        <Stack
          direction='row'
          fontSize='smaller'
          fontWeight='semibold'
          color='gray.500'
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
           <Box
            variant='ghost'
            onClick={expandReplies}
            _hover={{
              cursor: 'pointer'
            }}
          >
           {comment.replyCount  > 0 && `${comment.replyCount} replies`}
          </Box>
         
        </Stack>
        {editingMode && (
          <CommentBox replyOf={comment.id} onSubmit={commentSubmitHandler} />
        )}

        {comment.replyCount > 0 && childrenVisibleToggle && children}
      </Stack>
    </Box>
  )
}

export default CommentCard
