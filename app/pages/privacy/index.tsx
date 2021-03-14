import { Box, VStack, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Loudrr Privacy Policy</title>
      </Head>
      <VStack>
        <Box>
          <Heading id="short-privacy-policy" as="h3">
            A short privacy policy
          </Heading>
          <Text my={2}>
            Loudrr takes privacy very seriously and we are very transparent
            about the data we collect and data that is collected by any kind of
            third
            <br />
            By signin up on Loudrr, you are agreeing to the short privacy policy
            written below. Please go through, it won't take more than 5 minutes.
            this policy applies to this website and all the widget we
            distribute.
          </Text>
          <Heading id="personal" as="h3" my={2}>
            Personal Data Collection
          </Heading>
          <Heading id="name-email" as="h4" my={2} fontSize="2xl">
            Name and Email
          </Heading>
          <Text my={2}>
            Your name and email are pieces of private information that we
            collect during the sign up process. Even if you sign up with a
            social login, we will just collect you name, email and avatar
            picture if it exists.
            <br />
            You email will ONLY be used to communicate any updates for Loudrr
            and nothing else.
          </Text>
          <Heading id="other-personal" as="h4" my={2} fontSize="2xl">
            Other Personal Information.
          </Heading>
          <Text my={2}>
            We might also collect, you IP address, the OS your are using and the
            browser you using to provide you better support such as localization
            based on the country your are accessing Loudrr from.
          </Text>
          <Heading as="h3" my={2} id="general-data-collection">
            General Data Collection
          </Heading>
          <Text my={2}>
            Whenever as a user, you decide to use Loudrr widget on your blog or
            ecommerce website, we will collect the comments and the above
            information of the commenters who are commenting on your website.
            <br />
            Even if you have deleted the comment, it might remain in our
            database as it will help us better in differentiating spam from
            actual comments. It might serve better use for us if need to do some
            anonymnous analysis on the text that is coming in.
          </Text>
          <Heading as="h3" my={2} id="third-parties">
            Third Parties
          </Heading>
          <Text my={2}>
            We do not send your data to any third party. However, when you sign
            up with a social login, for example, google. Google will know that
            you have signed up for Loudrr and that's about it.
            <br />
            We do not send any infomation about you to any of the social
            services that you use to sign in.
          </Text>
          <Heading as="h3" my={2} id="no-tracking-cookies">
            Tracking and cookies
          </Heading>
          <Text my={2}>
            We do not in any way track which websites you visite besides Loudrr.
            We also do not use any third party service which will track you.
            <br />
            We only use cookies to maintain your session on Loudrr and for no
            other reason. Out cookies do not collect any other kind of data.
          </Text>
        </Box>
      </VStack>
    </>
  );
}
