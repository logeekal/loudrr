import { Box, ChakraProvider, Textarea } from '@chakra-ui/react'
import * as React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import OnBoarding from './components/Onboarding'
import APIService from './services/API'

interface Props {
  domainKey: string
}

export interface User {
  email: string
  name: string
  avatar: string
}

export const ExampleComponent = ({ domainKey }: Props) => {
  const [user, setUser] = useState<undefined | User>(undefined)
  console.log(domainKey)

  useEffect(() => {
    APIService.auth()
      .then((res) => {
        console.log(res.data)
        setUser(res.data)
      })
      .catch((err) => console.error(err))
  })
  return (
    <ChakraProvider>
    <div className='commenter'>
      {!user && (
        <Box maxW="500px">
        <OnBoarding
          mode={'signin'}
          onSuccess={() => {
            console.log('success')
          }}
        />
        </Box>
      )}
      {
        user && <Textarea />
      }
    </div>
    </ChakraProvider>
  )
}
