import Head from "next/head";
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
} from "@chakra-ui/react";
import OnBoarding from "../components/onboarding";
import APIService from "../service/service";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Talk to me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section>
          <img src="./assets/images/logo.png" />
        </section>

        <section className="Signup/Signin Form">
          <Flex width="full" align="flex-start" justifyContent="flex-start">
            <Box my={4}>
              <Tabs variant="encloses">
                <TabList>
                  <Tab>Sign in</Tab>
                  <Tab>Sign up</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <OnBoarding mode="signin" />
                  </TabPanel>
                  <TabPanel>
                    <OnBoarding mode="signup" />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
        </section>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}


export async function getServerSideProps(context) {
  console.log(context);
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
    console.log(authenticatedUser.data);
    console.log("------------------");
    console.log(authenticatedUser.status);
    console.log("------------------");
    return {
      props: { user: authenticatedUser.data },
    };
  } catch (err) {
  }
}
