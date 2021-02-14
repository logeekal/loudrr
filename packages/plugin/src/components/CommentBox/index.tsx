import React, { useContext } from 'react'
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
  useToast
} from '@chakra-ui/react'
import '@uiw/react-md-editor/dist/markdown-editor.css'
import { FaMarkdown } from 'react-icons/fa'
import { COMMENT_STATUS } from '../../constants'
import { DataContext, DataContextProps } from '../providers/DataProvider'

interface CommentBoxProps {
  replyOf? : string,
}

const CommentBox: FC<CommentBoxProps> = ({replyOf}) => {
  const [value, setValue] = React.useState<string | undefined>('')

  const { comments :{add} } = useContext<DataContextProps>(DataContext);

  const submitHandler = async () => {
    const parentCommentId = replyOf || null;
    await add(parentCommentId, value as string, COMMENT_STATUS.POSTED)
  }

  return (
    <Box
      boxShadow='lg'
      borderRadius={10}
      m={10}
      borderWidth={1}
      borderBlockStartWidth={0}
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
          <TabPanel className='container'>
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
      <Stack
        direction='row'
        spacing='5'
        align='flex-end'
        justify='flex-end'
        p='1rem'
        pt={0}
      >
        {/* <Button variant='outline' onClick={draftHandler}>
          Save Draft
        </Button> */}
        <Button variant='solid' onClick={submitHandler}>
          Submit
        </Button>
      </Stack>
    </Box>
  )
}

export default CommentBox
