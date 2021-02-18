import axios from 'axios'
import Head from "next/head";
import Router from 'next/router';
import React from "react";
import styles from "../styles/Home.module.css";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Link,
  Input,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Flex,
  Box,
  Collapse,
  Heading,
  Image,
  Divider,
  Text,
} from "@chakra-ui/react";
import OnBoarding from "../components/onboarding";
import APIService from "../service/service";
import Menu from "../components/Menu";
import MenuItem from "../components/MenuItem";
import Logo from "../components/Logo";
import MenuToggle from "../components/Menutoggle";
import HeroBlock from "../components/HeroBlock";

export default function Home(props) {
  console.log(props)
  if(props.user !== ""){
    Router.push('/dashboard')
  }


  const onSuccessfulSignin = () => {
    Router.push('/dashboard');
  }
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = React.useState(false);

  const toggle = () => setIsHeaderMenuOpen(!isHeaderMenuOpen);

  return (
    <Box className={styles.container} width="100vw">
      <Head>
        <title>Talk to me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="header" w="100%">
        <Flex
          as="nav"
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          wrap="wrap"
          w="99%"
          mb={0}
          p={5}
          bg={"transparent"}
        >
          <Logo />
          <MenuToggle toggle={toggle} isOpen={isHeaderMenuOpen} />
          <Box
            display={{ base: isHeaderMenuOpen ? "block" : "none", md: "block" }}
            flexBasis={{ base: "100%", md: "auto" }}
            justifyContent="flex-end"
          >
            <Menu>
              <MenuItem to="/plans">Plans</MenuItem>
              <MenuItem to="/faq">FAQ</MenuItem>
              <MenuItem to="/about">About</MenuItem>
            </Menu>
          </Box>
        </Flex>
      </Box>
      <Box
        as="main"
        className={styles.main}
        width="full"
        px={"2rem"}
        py={0}
        justifyContent="flex-start"
      >
        <Flex
          width="full"
          direction="row"
          justifyContent="space-between"
          wrap={{ base: "wrap", md: "wrap", xl: "nowrap" }}
        >
          <Box as="section" p={10} className="hero-img" mr={{ base: 0, md: 5 }}>
            <Image
              src="./assets/images/comments.png"
              alt="Guarenteed Privacy"
            />
          </Box>
          <Box
            as="section"
            p={10}
            className="hero-details"
            mr={{ base: 0, md: 5 }}
            flexGrow={["100%", "100%", "0"]}
            maxW={{ base: "full", md: "full", xl: "500px" }}
          >
            <Box>
              <Box mb={5}>
                <Heading>Full Featured Markdown editor</Heading>
                <Text mt={2}>
                  Let your readers express themselves with a fully featured
                  Markdown editor with complete emoji support.
                </Text>
              </Box>
            </Box>
            <Divider />
            <Box my={5}>
              <Heading>Private &amp; Open</Heading>
              <Text mt={2}>
                We don't sell ads. We don't sell data. We don't track you. We
                are completely open-source.
              </Text>
            </Box>
            <Divider></Divider>
            <Box my={5}>
              <Heading>Fully Customizable</Heading>
              <Text mt={2}>
                Embed our light and customizable widget in your website as a
                React Component or a simple javascript bundle.
              </Text>
            </Box>
            <Divider />
            <Box my={5}>
              <Heading>Free</Heading>
              <Text mt={2}>
                We give you three domain setup completely free as long as they
                have less than 1000 daily comments combined.
              </Text>
            </Box>
            <Box mt={5}>
              <Heading>Reply to a Reply to a Reply</Heading>
              <Text mt={2}>
                Engage in real conversations with deeply nested replies and
                detailed threads that all can be managed right in your dashboard
              </Text>
            </Box>
          </Box>
          <Box
            as="section"
            className=" onboarding-form"
            height="full"
            display="block"
            justifyContent="flex-start"
            alignItems="flex-start"
            display="flex"
          >
            <Flex
              width={{ base: "full", md: "full" }}
              minW="200px"
              align="flex-start"
              justifyContent="flex-start"
            >
              <Box
                my={4}
                borderRadius={0}
                borderWidt
                h={0}
                boxShadow="0"
                p={10}
              >
                <Box textAlign="left" paddingBlockEnd="5">
                  <Heading display="inline"></Heading>{" "}
                  <Heading className="" display="inline">
                    Start Today
                  </Heading>
                </Box>
                <Box mt={5}>
                  <Tabs isFitted>
                    <TabList>
                      <Tab>Sign in</Tab>
                      <Tab>Sign up</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <OnBoarding mode="signin" OnSuccess={onSuccessfulSignin} />
                      </TabPanel>
                      <TabPanel>
                        <OnBoarding mode="signup" />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <footer className={styles.footer}></footer>
    </Box>
  );
}

export async function getServerSideProps(context) {
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
    console.log('User validated Redirecting to dashboard')
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } catch (err) {
    console.log(`--------------`)
    console.log(err)
    return {
      props: {
        user: "",
      },
    };
  }
}