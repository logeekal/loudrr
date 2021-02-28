import { Spinner, ChakraProvider, Flex } from '@chakra-ui/react'
import * as React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import DataProvider from './components/providers/DataProvider'
import Thread from './components/Thread'
import { REQUEST_STATES } from './constants'
import { User } from './constants/types'
import APIService from './services/API'

export interface CommentWidgetProps {
  domainKey: string
}

const CommentWidget = ({ domainKey }: CommentWidgetProps) => {
  const [user, setUser] = useState<undefined | User>(undefined)
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATES.IDLE)

  // console.log(domainKey)

  useEffect(() => {
    setRequestStatus(REQUEST_STATES.PENDING)
    APIService.auth()
      .then((res) => {
        // console.log(res.data)
        setUser(res.data)
        setRequestStatus(REQUEST_STATES.SUCCESS)
      })
      .catch((err) => {
        console.error(err)
        setRequestStatus(REQUEST_STATES.ERROR)
      })
  }, [])

  if (requestStatus === REQUEST_STATES.PENDING) {
    return (
      <Flex h='100vh' justifyContent='center' alignItems='center'>
        <ChakraProvider>
          <Spinner size='xl' />
        </ChakraProvider>
      </Flex>
    )
  }
  return (
    <ChakraProvider>
      <DataProvider domainKey={domainKey} authenticatedUser={user as User}>
        <div className='commenter'>
          <Thread domainKey={domainKey} />
        </div>
      </DataProvider>
    </ChakraProvider>
  )
}

export default CommentWidget
