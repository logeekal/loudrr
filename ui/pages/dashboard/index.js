import {
  Avatar,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Table,
  Tbody,
  Text,
  Th,
  Tr,
  Input,
  Divider,
  Button,
  FormHelperText,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import APIService from "../../service/service";
import { DOMAIN_CREATION_STATUS, REQUEST_STATES } from "../../utils/constants";

export default function DashBoard(props) {
  console.log(props);
  const [areDomainsActive, setAreDomainsActive] = useState(
    props["domains"].length !== 0
  );

  const toast = useToast();
  const [requestState, setRequestState] = useState(REQUEST_STATES.IDLE);
  const [domain, setDomain] = useState("");
  const [domainData, setDomainData] = useState({});
  const [domainCreationStatus, setDomainCreationStatus] = useState(
    DOMAIN_CREATION_STATUS.NOT_STARTED
  );

  const handleDomainCreation = async (e) => {
    e.preventDefault();
    console.log(domainCreationStatus);
    if(domainCreationStatus === DOMAIN_CREATION_STATUS.COMPLETE){
      Router.push(`website?key=${domainData.key}`);
      return;
    }
    setRequestState(REQUEST_STATES.PENDING);
    try {
      const createdDomain = await APIService.createDomain(domain);
      console.log(`Setting the domain data as `, createdDomain.data);
      setDomainData(createdDomain.data);
      setRequestState(REQUEST_STATES.SUCCESS);
      setDomainCreationStatus(DOMAIN_CREATION_STATUS.COMPLETE)
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
    <div className="dashboard-page">
      <Head>
        <title>
          {areDomainsActive ? `Dashboard - ${props.user.name}` : "Add website"}
        </title>
      </Head>
      {!areDomainsActive && (
        <div className="domain-onboarding">
          <Flex
            width="full"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Box borderRadius="lg" boxShadow="lg" p={10} background="white" maxW="500px">
              <Heading mb={5}>Add a Website to get started</Heading>
              <Divider />
              <form mt={5} onSubmit={handleDomainCreation}>
                <FormControl id="name" mt={5}>
                  <HStack>
                    <FormLabel htmlFor="avatar" width={65}>Owner</FormLabel>
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
                    <FormLabel width={75} htmlFor="website">Website</FormLabel>
                    <Input
                      id="website"
                      placeholder="example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      isRequired
                      isReadOnly={'key' in domainData ? true : false}
                    ></Input>
                  </HStack>
                </FormControl>
                {('key' in domainData) && (
                  <FormControl mt={5}>
                    <HStack>
                      <FormLabel width={75} >Key</FormLabel>
                      <Input isReadOnly value={domainData.key} variant="filled" />
                    </HStack>
                    <FormHelperText>
                      This is the key that you will use to embed{" "}
                      {process.env.BRAND_NAME} in your website. Do not worry, you will be able to see it and use it going forward
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
                    ) : (
                      domainCreationStatus === DOMAIN_CREATION_STATUS.COMPLETE ? "Proceed" : "Create Website"                    
                    )}
                  </Button>
                </FormControl>
              </form>
            </Box>
          </Flex>
        </div>
      )}
    </div>
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
    const userDomains = await APIService.getDomains({
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    });

    result["domains"] = userDomains.data;

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
