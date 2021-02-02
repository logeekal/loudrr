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
import { useEffect, useState } from "react";
import APIService from "../../service/service";
import { REQUEST_STATES } from "../../utils/constants";

export default function DashBoard(props) {
  console.log(props);
  const [areDomainsActive, setAreDomainsActive] = useState(
    props["domains"].length !== 0
  );


  const toast = useToast();
  const [requestState, setRequestState] = useState(REQUEST_STATES.IDLE);
  const [domain, setDomain] = useState("");
  const [domainKey, setDomainKey] = useState(undefined);

  const handleDomainCreation = async () => {
    setRequestState(REQUEST_STATES.PENDING);
    try {
      const createdDomain = await APIService.createDomain(domain);
      setDomainKey(createdDomain.key);
    } catch (err) {
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
            <Box borderRadius="lg" boxShadow="lg" p={10} background="white">
              <Heading mb={5}>Add a Website to get started</Heading>
              <Divider />
              <form mt={5}>
                <FormControl id="name" mt={5}>
                  <HStack>
                    <FormLabel htmlFor="avatar">Owner</FormLabel>
                    <Avatar
                      id="avatar"
                      name={props.user.name}
                      src={props.user.avatar}
                    />
                    <Text>{props.user.name}</Text>
                  </HStack>
                </FormControl>
                <FormControl mt={5}>
                  <HStack>
                    <FormLabel>Website</FormLabel>
                    <Input
                      placeholder="example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      isRequired
                    ></Input>
                  </HStack>
                </FormControl>
                <FormControl mt={5}>
                  <Button
                    variant="solid"
                    width="full"
                    onClick={handleDomainCreation}
                  >
                    {requestState === REQUEST_STATES.PENDING ? (
                      <Spinner />
                    ) : (
                      "Done"
                    )}
                  </Button>
                </FormControl>
                {domainKey && (
                  <FormControl mt={5}>
                    <FormLabel>Key</FormLabel>
                    <Input isReadOnly>{domainKey} </Input>
                    <FormHelperText>
                      This is the key that you will use to embed $
                      {process.env.BRAND_NAME} in your website{" "}
                    </FormHelperText>
                  </FormControl>
                )}
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
