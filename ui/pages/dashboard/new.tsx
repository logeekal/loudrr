import {
  Box,
  Stack,
  FormLabel,
  FormControl,
  Avatar,
  HStack,
  Input,
  Divider,
  Heading,
  Text,
  useClipboard,
  useToast,
  Flex,
  FormHelperText,
  Button,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import APIService from "../../service/API";
import { DOMAIN_CREATION_STATUS, REQUEST_STATES } from "../../utils/constants";
import { IDomain, User } from "../../utils/types";

export interface NewDomainProps {
  user: User;
}

export default function NewDomain(props: NewDomainProps) {
  const toast = useToast();
  const [requestState, setRequestState] = useState(REQUEST_STATES.IDLE);
  const [domain, setDomain] = useState("");
  const [domainCreationStatus, setDomainCreationStatus] = useState(
    DOMAIN_CREATION_STATUS.NOT_STARTED
  );

  const [domainData, setDomainData] = useState<IDomain>();
  const { onCopy, hasCopied } = useClipboard(domainData.key);

  const handleDomainCreation = async (e) => {
    e.preventDefault();
    console.log(domainCreationStatus);
    if (domainCreationStatus === DOMAIN_CREATION_STATUS.COMPLETE) {
      window.location.href = "/dashboard";
      return;
    }
    setRequestState(REQUEST_STATES.PENDING);
    try {
      const createdDomain = await APIService.createDomain(domain, {});
      console.log(`Setting the domain data as `, createdDomain.data);
      setDomainData(createdDomain.data);
      setRequestState(REQUEST_STATES.SUCCESS);
      setDomainCreationStatus(DOMAIN_CREATION_STATUS.COMPLETE);
    } catch (err) {
      setRequestState(REQUEST_STATES.ERROR);
      console.log(err);
      toast({
        title: "Some Error Occured",
        status: "error",
      });
    }
  };

  return (
    <Box width="full">
      <Head>
        <title>Add new Domain.</title>
      </Head>
      <div className="domain-onboarding">
        <Flex
          width="full"
          justifyContent="center"
          alignItems="center"
          height="100vh"
                >
          <Box
            borderRadius="lg"
            boxShadow="lg"
            p={10}
            background="white"
            maxW="500px"
          sx={{
              position:"absolute",
              top: "50vh",
              left: "50vw",
              transform: "translate(-50%,-50%)"
              
          }}
  >
            <Heading mb={5}>Add a new Website</Heading>
            <Divider />
            <form onSubmit={handleDomainCreation}>
              <FormControl id="name" mt={5}>
                <HStack>
                  <FormLabel htmlFor="avatar" width={65}>
                    Owner
                  </FormLabel>
                  <Avatar
                    id="avatar"
                    name={props.user.name}
                    src={props.user.avatar}
                    ml={"-5px"}
                  />
                  <Text>{props.user.name}</Text>
                </HStack>
              </FormControl>
              <FormControl mt={5}>
                <HStack>
                  <FormLabel width={75} htmlFor="website">
                    Website
                  </FormLabel>
                  <Input
                    id="website"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    isRequired
                    isReadOnly={"key" in domainData ? true : false}
                  ></Input>
                </HStack>
              </FormControl>
              {"key" in domainData && (
                <FormControl mt={5}>
                  <HStack>
                    <FormLabel width={75}>Key</FormLabel>
                    <Input
                      isReadOnly
                      value={domainData.key}
                      variant="filled"
                      type="password"
                    />
                    <Button
                      onClick={onCopy}
                      variant={hasCopied ? "solid" : "outline"}
                    >
                      {hasCopied ? "Copied" : "Copy"}
                    </Button>
                  </HStack>
                  <FormHelperText>
                    This is the key that you will use to embed
                    {process.env.BRAND_NAME} in your website. Do not worry, you
                    will be able to see it and use it going forward
                  </FormHelperText>
                </FormControl>
              )}
              <FormControl mt={5}>
                <Button
                  variant="solid"
                  width="full"
                  onClick={handleDomainCreation}
                >
                  {requestState === REQUEST_STATES.PENDING ? (
                    <Spinner />
                  ) : domainCreationStatus ===
                    DOMAIN_CREATION_STATUS.COMPLETE ? (
                    "Proceed"
                  ) : (
                    "Create Website"
                  )}
                </Button>
              </FormControl>
            </form>
          </Box>
        </Flex>
      </div>
    </Box>
  );
}

export async function getServerSideProps(context) {
  let result = {};

  try {
    const authenticatedUser = await axios.post(
      `http://localhost:3030/auth`,
      {},
      {
        headers: context.req
          ? { cookie: context.req.headers.cookie }
          : undefined,
      }
    );

    result["user"] = authenticatedUser.data;
    return {
      props: { ...result },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

import { Amplify } from "aws-amplify";

Amplify.configure({ ssr: true });
