import { Box, Spinner, ChakraProvider } from '@chakra-ui/react'
import * as React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import OnBoarding from './components/Onboarding'
import Thread from './components/Thread'
import { REQUEST_STATES } from './constants'
import APIService from './services/API'

export interface CommentWidgetProps {
  domainKey: string
}


const CommentWidget = ({ domainKey }: CommentWidgetProps) => {
  const [user, setUser] = useState<undefined | User>(undefined)
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATES.IDLE)

  console.log(domainKey)

  useEffect(() => {
    setRequestStatus(REQUEST_STATES.PENDING)
    APIService.auth()
      .then((res) => {
        console.log(res.data)
        setUser(res.data)
        setRequestStatus(REQUEST_STATES.SUCCESS)
      })
      .catch((err) => {
        console.error(err)
        setRequestStatus(REQUEST_STATES.ERROR)
      })
  }, [])

  if (requestStatus === REQUEST_STATES.PENDING) {
    return <Spinner />
  }
  return (
    <ChakraProvider>
      <div className='commenter'>
        {!user && (
          <Box maxW='500px'>
            <OnBoarding
              mode={'signin'}
              onSuccess={(user: User) => {
                setUser(user)
                console.log('success')
              }}
            />
          </Box>
        )}
        {user && <React.Fragment></React.Fragment>}
      </div>
      <Thread domainKey={domainKey} />
    </ChakraProvider>
  )
}

export default CommentWidget
