import React, { useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  FormErrorMessage,
  Tooltip
} from '@chakra-ui/react'
import API from '../services/API'
import { REQUEST_STATES } from '../constants'
import { FC } from 'react'

export interface OnBoardingFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: any
}

export interface ErrorFormat {
  error: string
  field: 'email' | 'name' | 'password' | 'confirm-password'
}

const OnBoardingForms: React.FC<OnBoardingFormProps> = ({
  mode,
  onSuccess
}: OnBoardingFormProps) => {
  const [requestState, setRequestState] = React.useState(REQUEST_STATES.IDLE)
  const toast = useToast()

  console.log(requestState)

  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState<ErrorFormat>()
  const [popupId, setPopupId] = React.useState<null | Window>()

  const handleSignup = async (e: any) => {
    e.preventDefault()
    let err = validate()
    // console.log({err})
    if (err) {
      // console.log({err})
      setError(err)
      return
    }
    setRequestState(REQUEST_STATES.PENDING)
    // console.log(e)
    try {
      await API.signup(email, password, name)
      toast({
        title: 'Account Succesfully Created.',
        description: 'Please sign in to proceed',
        status: 'success',
        duration: 5000,
        isClosable: true
      })

      setRequestState(REQUEST_STATES.SUCCESS)
      onSuccess()
    } catch (err) {
      setError({
        field: 'email',
        error: 'Email Id Already exists '
      })

      toast({
        title: 'Error',
        description: '',
        status: 'error',
        isClosable: true
      })
      setRequestState(REQUEST_STATES.ERROR)
    }
  }

  const openAuthPopUp = (name: string, address: string): Window | null => {
    const hasWindow = typeof window !== 'undefined'
    if (hasWindow) {
      return window.open(
        address,
        name,
        'height=500,width=400,left=50%,top=50%,scrollbars=no,toolbar=no,menubar=no, status=yes'
      )
    }
    return null
  }

  useEffect(() => {
    console.log(`Popup id changed .. `)
    let interval: any
    if (popupId) {
      interval = setInterval(() => {
        API.auth()
          .then((res) => {
            console.log('Auth Successfull : ', res.data)
            popupId.close()
            clearInterval(interval)
            onSuccess(res.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }, 500)
    }

    return () => interval && clearInterval(interval)
  }, [popupId])

  const handleOAuth = (platform: string) => {
    if (popupId) {
      popupId.close()
    }
    let authPopup = openAuthPopUp(
      platform,
      `http://staging.loudrr.app/auth/${platform}`
    )
    setPopupId(authPopup)
  }

  const handleSignin = async (e: any) => {
    try {
      e.preventDefault()
      const loggedInUserRequest = await API.login(email, password)
      if (loggedInUserRequest.status === 200) {
        toast({
          title: 'logged In',
          status: 'success',
          isClosable: true
        })
        onSuccess(loggedInUserRequest.data)
      } else {
        console.log(loggedInUserRequest)
      }
    } catch (e) {
      setError({
        field: 'password',
        error: 'Invalid Credentials. Please try again'
      })
    }
  }

  const validate = () => {
    // debugger;
    let err: ErrorFormat | undefined
    if (password.length < 8) {
      err = {
        field: 'password',
        error: 'Password should be at least 8 character long.'
      }
    } else if (password !== confirmPassword) {
      err = {
        field: 'confirm-password',
        error: 'Password and Confirm password should match'
      }
    }
    return err
  }

  return (
    <div>
      <form onSubmit={mode === 'signin' ? handleSignin : handleSignup}>
        {mode === 'signup' && (
          <React.Fragment>
            <FormControl id='name' isRequired>
              <FormLabel>Your Name</FormLabel>
              <Input
                type='name'
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            </FormControl>
          </React.Fragment>
        )}
        <FormControl
          id='email'
          isRequired
          isInvalid={error && error.field === 'email'}
        >
          <FormLabel mt={mode === 'signup' ? 5 : 0}>Email Address</FormLabel>
          <Input
            type='email'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl
          id='password'
          isRequired
          isInvalid={error && error.field === 'password'}
        >
          <FormLabel mt={5}>Password</FormLabel>
          <Input
            type='password'
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <FormErrorMessage>{error?.error}</FormErrorMessage>
        </FormControl>
        {mode === 'signup' && (
          <React.Fragment>
            <FormControl
              id='confirm-password'
              isRequired
              isInvalid={error && error.field === 'confirm-password'}
            >
              <FormLabel mt={5}>Confirm Password</FormLabel>
              <Input
                type='password'
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
              />
              <FormErrorMessage>{error?.error}</FormErrorMessage>
            </FormControl>
          </React.Fragment>
        )}
        <Button width='full' type='submit' mt={5}>
          {mode === 'signin' ? 'Sign in' : 'Sign Up'}
        </Button>
      </form>
      <Box mt={10} with='full'>
        <Tooltip hasArrow placement='auto' label='Coming Soon!'>
          <Button
            width='full'
            bg='red.300'
            onClick={() => handleOAuth('google')}
          >
            Sign in with Google
          </Button>
        </Tooltip>
        <Tooltip hasArrow placement='auto'>
          <Button mt={4} width='full' bg='blue.500' color='white'>
            Sign in with Facebook
          </Button>
        </Tooltip>
        <Tooltip hasArrow placement='auto'>
          <Button
            mt={4}
            width='full'
            bg='grey'
            color='white'
            onClick={() => handleOAuth('github')}
          >
            Sign in with Github
          </Button>
        </Tooltip>
      </Box>
    </div>
  )
}

export interface OnBoardingProps {
  onSuccess: any
}

const OnBoarding: FC<OnBoardingProps> = ({ onSuccess }: OnBoardingProps) => {
  const [activeTabIndex, setActiveTabIndex] = React.useState(1)

  const handleTabsChange = (index: number) => {
    setActiveTabIndex(index)
  }

  return (
    <Box w='full' justifyContent='flex-end' display='flex' flexDirection='row'>
      <Tabs maxW='600px' index={activeTabIndex} onChange={handleTabsChange}>
        <TabList>
          <Tab>Sign In</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OnBoardingForms mode='signin' onSuccess={onSuccess} />
          </TabPanel>
          <TabPanel>
            <OnBoardingForms
              mode='signup'
              onSuccess={() => {
                setActiveTabIndex(0)
                onSuccess()
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default OnBoarding
