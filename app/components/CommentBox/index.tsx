import React, { useContext, useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { FC } from 'react'
import {
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Box,
  Link,
  Button,
  Stack,
  Collapse,
  useDisclosure
} from '@chakra-ui/react'
import '@uiw/react-md-editor/dist/markdown-editor.css'
import { FaMarkdown } from 'react-icons/fa'
import { COMMENT_STATUS, REQUEST_STATES } from '../../utils/constants'
import { DataContext, DataContextProps } from '../providers/DataProvider'
import OnBoarding from '../Onboarding'

interface CommentBoxProps {
  replyOf?: string
  onSubmit: any
}

const CommentBox: FC<CommentBoxProps> = ({ replyOf, onSubmit }) => {
  const [value, setValue] = React.useState<string | undefined>('')
  const {isOpen: isLoginOpen, onToggle: toggleLoginBox } = useDisclosure();
  
  
  const {
    comments: { add },
    user: { loggedinUser, checkAuth }
  } = useContext<DataContextProps>(DataContext)

  const submitHandler = async () => {
    if(!value){
      return;
    }
    const parentCommentId = replyOf || null

    await add(parentCommentId, value as string, COMMENT_STATUS.POSTED)
    setValue("");
    onSubmit()
  }

  const loginHandler = () => {
    if (!loggedinUser) {
      toggleLoginBox()
    }
  }

  return (
    <Box
      boxShadow='sm'
      borderRadius={10}
      borderWidth={1}
      borderBlockStartWidth={0}
      mt={1}
    >
      <Tabs size='md' variant='enclosed'>
        <TabList position='relative'>
          <Tab>Write</Tab>
          <Tab>Preview</Tab>
          <Box
            position='absolute'
            right={'1rem'}
            textAlign='center'
            height='full'
            display='flex'
            alignItems='center'
          >
            <Link
              href='https://github.com/uiwjs/react-markdown-preview/'
              aria-label='UIW'
              target='#'
            >
              <FaMarkdown />
            </Link>
          </Box>
        </TabList>
        <TabPanels>
          <TabPanel className='md-container' p={0}>
            <MDEditor
              placeholder='Start writing here in markdown'
              value={value}
              height={170}
              onChange={setValue}
              preview='edit'
              hideToolbar={false}
            />
          </TabPanel>
          <TabPanel>
            <MDEditor.Markdown
              source={(value as string) || 'Nothing to Preview'}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Stack direction='row' spacing='5' align='center' justify='flex-end'>
        <Button
          variant='solid'
          onClick={loggedinUser ? submitHandler : loginHandler}
          borderRadius={0}
          borderBottomRightRadius={10}
        >
          {loggedinUser ? `Submit as ${loggedinUser.name}` : `Login to Proceed`}
        </Button>
      </Stack>
      <Collapse in={isLoginOpen}>
        <OnBoarding onSuccess={async () => {toggleLoginBox(); await checkAuth()}} />
      </Collapse>
    </Box>
  )
}

export default CommentBox
