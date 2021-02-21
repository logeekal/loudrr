import axios from "axios";
import Head from "next/head";
import Router from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Link,
  Flex,
  Box,
  Heading,
  Divider,
  VStack,
  HStack,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import OnBoarding from "../components/Onboarding";
import { motion, AnimatePresence } from "framer-motion";
import HeroHeading, { HeroText } from "../components/HeroHeading";
import TechLogo from "../components/TechLogo";

export default function Home(props) {
  const [visibleHeroIdx, setVisibleHeroIdx] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setTimeout(() => {
      const totalCards = HeroCards.length;
      setIsVisible(false);
      if (visibleHeroIdx === totalCards - 1) {
        console.log("Chaning hero index to ", 0);
        setVisibleHeroIdx(0);
      } else {
        console.log("Chaning hero index to ", visibleHeroIdx + 1);
        setVisibleHeroIdx(visibleHeroIdx + 1);
      }
    }, 5100);

    // clearTimeout(interval);

    return () => {
      clearTimeout(interval);
    };
  }, [visibleHeroIdx]);

  if (props.user !== "") {
    Router.push("/dashboard");
  }

  const onSuccessfulSignin = () => {
    Router.reload();
  };

  return (
    <VStack w="full">
      <Head>
        <title>Talk to me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        className="hero-container"
        width="full"
        px={{ base: "0rem", md: "0rem", xl: "2rem" }}
        py={0}
        justifyContent="flex-start"
        maxW="1200px"
      >
        <Flex
          width="full"
          direction="row"
          justifyContent="center"
          wrap={{ base: "wrap", md: "wrap", xl: "nowrap" }}
        >
          <VStack className="hero" maxW={"550px"} m={5} mr={10}>
            <AnimatePresence
              exitBeforeEnter
              onExitComplete={() => setIsVisible(true)}
            >
              {isVisible &&
                HeroCards.map((card, index) => {
                  if (index === visibleHeroIdx) {
                    return card;
                  }
                })}
            </AnimatePresence>
            <HStack spacing={5} py={"2.5rem"}>
              {HeroCards.map((val, index) => {
                return (
                  <Divider
                    key={index}
                    h={1}
                    bg={index === visibleHeroIdx ? "#AC36C9" : "gray.400"}
                    w={"50px"}
                    boxShadow={index === visibleHeroIdx ? "xl" : "none"}
                    sx={{
                      _hover: {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => setVisibleHeroIdx(index)}
                  />
                );
              })}
            </HStack>
            <Wrap spacing={10} width="full">
              <WrapItem justifyContent="center" alignItems="center">
                <Link href="/docs">
                  <Button
                    variant="solid"
                    bgGradient="linear(to-r, rgba(172,54,201,0.7), rgba(51,101,229,1))"
                    color="white"
                    _hover={{
                      bgGradient:
                        "linear(to-r, rgba(172,54,201,0.7), rgba(51,101,229,1))",
                      color: "white",
                    }}
                    _active={{
                      bgGradient:
                        "linear(to-r, rgba(172,54,201,0.7), rgba(51,101,229,1))",
                      color: "white",
                      transform: "scale(0.98)",
                    }}
                  >
                    Get Started with Docs
                  </Button>
                </Link>
              </WrapItem>
            </Wrap>
          </VStack>
          <Box className="onboarding" mx={5}>
            <OnBoarding onSuccess={onSuccessfulSignin} />
          </Box>
        </Flex>
        <Box
          className="about"
          fontSize={"1.3rem"}
          color="gray.400"
          maxW="full"
          p={5}
          textAlign="center"
          fontWeight="medium"
          mt={5}
        >
          TalkToMe makes it very easy to add and manage comments to your blogs
          or product reviews to your e-Commerce website with a minimal setup.
          Start with our{" "}
          <Link href="/docs" color="#AC36C9">
            documentation
          </Link>{" "}
          today.
        </Box>
      </Box>
      <Box
        className="availability"
        w="full"
        position="relative"
        sx={{
          marginBlockStart: "2rem !important",
        }}
      >
        <VStack
          wrap="wrap"
          bgGradient="linear(to-r, rgba(172,54,201,0.7), rgba(51,101,229,1))"
          position="absolute"
          left={0}
          right={0}
          width="100vw"
          marginInlineStart={-5}
          height="auto"
          p={5}
          spacing={10}
        >
          <Heading color="white" fontWeight="bold" textAlign="center" w="full">
            Plugins Coming soon.
          </Heading>
          <HStack
            wrap="wrap"
            w="80%"
            justifyContent="space-around"
            paddingBlockStart={5}
            paddingBlockEnd={25}
          >
            <TechLogo
              src="/assets/logo/squarespace.png"
              title="Squarespace"
              bg="black"
            />
            <TechLogo
              src="/assets/logo/shopify.png"
              title="Shopify"
              bg="#7ab55c"
            />
            <TechLogo
              src="/assets/logo/gatsby.png"
              title="Gatsby"
              bg="#663399"
            />
            <TechLogo
              src="/assets/logo/wordpress.png"
              title="Wordpress"
              bg="#15a4cc"
            />
            <TechLogo src="/assets/logo/react.png" title="React" bg="black" />
          </HStack>
        </VStack>
      </Box>
    </VStack>
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
    console.log("User validated Redirecting to dashboard");
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } catch (err) {
    console.log(`--------------`);
    // console.log(err)
    return {
      props: {
        user: "",
      },
    };
  }
}

const AnimatedHero = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateX(50px)" }}
      animate={{ opacity: 1, transform: " translateX(0px)" }}
      exit={{ opacity: 0, transform: "translateX(-50px)" }}
      transition={{
        delay: 0.2,
        x: { type: "spring", stiffness: 100 },
        default: { duration: 0.8 },
      }}
    >
      {children}
    </motion.div>
  );
};

const HeroCards: ReactNode[] = [
  <AnimatedHero>
    <VStack>
      <HeroHeading text="Full Featured Markdown Editor." indices={[2]} />
      <HeroText>
        Let your users express themselves with Rich Text and without any
        limitations
      </HeroText>
    </VStack>
  </AnimatedHero>,
  <AnimatedHero>
    <VStack>
      <HeroHeading
        text="No Tracking. No Spam. &nbsp; No Ads."
        indices={[1, 3, 6]}
      />
      <HeroText>
        Give your users a zen experience with no tracking and no ads or any kind
        of personal data collection
      </HeroText>
    </VStack>
  </AnimatedHero>,
  <AnimatedHero>
    <VStack>
      <HeroHeading text="Reply to a Reply to a Reply." indices={[0, 3, 6]} />
      <HeroText>
        Engage in real conversations with deeply nested replies and threads
        managed in your dashboard
      </HeroText>
    </VStack>
  </AnimatedHero>,
  <AnimatedHero>
    <VStack>
      <HeroHeading
        text="Lifetime &nbsp; Free Tier &nbsp; Plan."
        indices={[2, 3]}
      />
      <HeroText>
        Lifetime Free as long as you have 2 domains and less than 100 comments
        daily combined
      </HeroText>
    </VStack>
  </AnimatedHero>,
];

import { Amplify } from "aws-amplify";
import awsExports from "../src/aws-exports";
Amplify.configure({...awsExports, ssr: true });

