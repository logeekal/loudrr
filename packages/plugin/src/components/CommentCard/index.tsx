import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
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
    console.log({ comment })
    debugger
  }
  const [editingMode, setEditingMode] = useState(false)
  const handleReply = () => {
    setEditingMode(!editingMode)
  }
  const { num, off } = getTimeDifference(comment.createDate)
  let dateString = `${num} ${off} ago`
  if (num === 0) {
    dateString = 'Now'
  }

  const commentSubmitHandler = () => {
    if (comment.id) {
      setEditingMode(false)
    }
  }

  return (
    <Box key={comment.id}>
      <Stack
        className={`level-${level}`}
        direction='column'
        marginInlineStart={`${level * 0.5}rem`}
        borderWidth={1}
        p={5}
        boxShadow='md'
      >
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
        </Stack>
        {comment.replyCount > 0 && (
          <Accordion
            allowMultiple
            allowToggle
            py={0}
            my={0}
            onChange={(expandIdx) => {
              if (expandIdx) {
                childrenHandler()
              }
            }}
          >
            {editingMode && (
              <CommentBox
                replyOf={comment.id}
                onSubmit={commentSubmitHandler}
              />
            )}
            <AccordionItem>
              <AccordionButton>{comment.replyCount} replies</AccordionButton>
              <AccordionPanel>
                {
                  // list of commentBoxes
                  children
                }
              </AccordionPanel>
            </AccordionItem>
            <Box _hover={{ cursor: 'pointer' }} onClick={childrenHandler}></Box>
          </Accordion>
        )}
      </Stack>
    </Box>
  )
}

export default CommentCard
