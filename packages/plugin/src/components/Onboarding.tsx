import React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/react'
import API from '../services/API'
import { REQUEST_STATES } from '../constants'
import { FC } from 'react'

export interface OnBoardingFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: any
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

  const handleSignup = async (e: any) => {
    e.preventDefault()
    setRequestState(REQUEST_STATES.PENDING)
    console.log(e)
    const result = await API.signup(email, password, name)
    if (result.status === 200) {
      console.log(result.data)
      toast({
        title: 'Account Succesfully Created.',
        description: 'Please sign in to proceed',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      setRequestState(REQUEST_STATES.SUCCESS)
    } else {
      toast({
        title: 'Error',
        description: result.data,
        status: 'error',
        isClosable: true
      })
      setRequestState(REQUEST_STATES.ERROR)
    }
  }

  const handleSignin = async (e: any) => {
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
        <FormControl id='email' isRequired>
          <FormLabel mt={mode === 'signup' ? 5 : 0}>Email Address</FormLabel>
          <Input
            type='email'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id='password' isRequired>
          <FormLabel mt={5}>Password</FormLabel>
          <Input
            type='password'
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </FormControl>
        {mode === 'signup' && (
          <React.Fragment>
            <FormControl id='confirm-password' isRequired>
              <FormLabel mt={5}>Confirm Password</FormLabel>
              <Input
                type='password'
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
              />
              <FormHelperText>
                {password !== confirmPassword &&
                  confirmPassword.length > 0 &&
                  'Password and Confirm Password should match'}
              </FormHelperText>
            </FormControl>
          </React.Fragment>
        )}
        <Button width='full' type='submit' mt={5}>
          {mode}
        </Button>
      </form>
      <Box mt={10} with='full'>
        <Button width='full' bg='red.300'>
          Sign in with Google
        </Button>
        <Button mt={4} width='full' bg='blue.500' color='white'>
          Sign in with Facebook
        </Button>
        <Button mt={4} width='full' bg='grey' color='white'>
          Sign in with Github
        </Button>
      </Box>
    </div>
  )
}

export interface OnBoardingProps {
  onSuccess: any
}

const OnBoarding: FC<OnBoardingProps>  = ({ onSuccess }: OnBoardingProps) => {
  return (
    <Tabs>
      <TabList>
        <Tab>Sign In</Tab>
        <Tab>Sign Up</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <OnBoardingForms mode='signin' onSuccess={onSuccess} />
        </TabPanel>
        <TabPanel>
          <OnBoardingForms mode='signup' onSuccess={onSuccess} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}




export default OnBoarding;