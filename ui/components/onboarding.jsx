import React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import API from "../service/service";
import { REQUEST_STATES } from "../utils/constants";

const OnBoarding = ({ mode }) => {
  const [requestState, setRequestState] = React.useState(REQUEST_STATES.IDLE);
  const toast = useToast();

  //fields
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSignup = async (e) => {
   e.preventDefault();
    setRequestState(REQUEST_STATES.PENDING);
    console.log(e);
    const result = await API.signup(email, password, name);
    if (result.status === 200) {
      console.log(result.data);
      toast({
        title: "Account Succesfully Created.",
        description: "Please sign in to proceed",
        status: "success",
        duration: "5000",
        isClosable: true,
      });
      setRequestState(REQUEST_STATES.SUCCESS);
    } else {
      toast({
        title: "Error",
        description: result.data,
        status: "error",
        isClosable: true,
      });
      setRequestState(REQUEST_STATES.ERROR);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const loggedInUserRequest = await API.login(email, password);
    if(loggedInUserRequest.status === 200){
        toast({
          title: "logged In",
          status: "success",
          isClosable: true
        })
    }else{
        console.log(loggedInUserRequest)
    }
  };

  return (
    <form onSubmit={mode === "signin" ? handleSignin : handleSignup}>
      {mode === "signup" && (
        <React.Fragment>
          <FormControl id="name" isRequired>
            <FormLabel>Your Name</FormLabel>
            <Input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </React.Fragment>
      )}
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired mt={5}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      {mode === "signup" && (
        <React.Fragment>
          <FormControl id="confirm-password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FormHelperText>
              {password !== confirmPassword &&
                confirmPassword.length > 0 &&
                "Password and Confirm Password should match"}
            </FormHelperText>
          </FormControl>
        </React.Fragment>
      )}
      <Button width="full" type="submit" mt={5}> {mode} </Button>
    </form>
  );
};

export default OnBoarding;
