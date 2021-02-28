import {
  Box,
  Tabs,
  TabList,
  Tab,
  VStack,
  Heading,
  Text,
  OrderedList,
  ListItem,
  Link,
  List,
  ListIcon,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Code,
} from "@chakra-ui/react";
import { Layout } from "antd";
import Head from "next/head";
import NextLink from "next/link";
import Router from "next/router";
import { useEffect } from "react";
import { MdCheckCircle, MdLink } from "react-icons/md";
import CustomCode from "../../components/CustomCode";
import TechLogo from "../../components/TechLogo";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-jsx";
import QnA from "../../components/QnA";

const { Sider, Content } = Layout;

const docData: Array<{
  sectionName: string;
  sectionTitle: string;
  sectionLink?: string;
}> = [
  {
    sectionName: "about",
    sectionTitle: "About",
  },
  {
    sectionName: "installation",
    sectionTitle: "Installing Loudrr",
  },
  {
    sectionName: "faq",
    sectionTitle: "FAQs",
    sectionLink: "#faq",
  },
];

export default function Docs() {
  const { NEXT_PUBLIC_BRAND_NAME: BRAND } = process.env;
  return (
    <Box width="full" h="auto">
      <Head>
        <title>Documentation for {BRAND}</title>
      </Head>
      <Layout>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => console.log(broken)}
          onCollapse={(collapsed, type) => console.log(collapsed, type)}
        >
          <Box w="full" py={10}>
            <Tabs orientation="vertical">
              <TabList textAlign="left" w="full">
                {docData.map((doc) => {
                  return (
                    <Tab
                      key={doc.sectionName}
                      w="full"
                      textAlign="left"
                      justifyContent="flex-start"
                      onClick={() => Router.push("#" + doc.sectionName)}
                    >
                      {doc.sectionTitle}
                    </Tab>
                  );
                })}
              </TabList>
            </Tabs>
          </Box>
        </Sider>
        <Layout>
          <Content>
            <Box p={10} bg="white">
              <VStack>
                <Box as="section" id="about" color="gray.900">
                  <Heading as="h3"> About Loudrr </Heading>
                  <br />
                  <Text>
                    Congratulations on reaching the documentation page of{" "}
                    {BRAND}. Since, you are here, we assume you know what Loudrr
                    is and we will explain how you can use {BRAND} in your own
                    app. Honestly, there is not much to explain. IT IS PRETTY
                    EASY.
                  </Text>
                  <br />
                  <Box>
                    {BRAND} is currenly in{" "}
                    <Link
                      href="https://www.webopedia.com/definitions/alpha-version"
                      isExternal
                    >
                      alpha
                    </Link>{" "}
                    stage and hence, you will be one of the first users to use{" "}
                    {BRAND} and give direction to the product. {BRAND} is a
                    completely opensource application, which means three things
                    :
                    <List spacing={3} pt={3}>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="green.500" />
                        You can raise issues your facing directly{" "}
                        <Link href="https://github.com/logeekal/loudrr/issues">
                          here.
                        </Link>
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="green.500" />
                        You have a say in features this product will have.
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="green.500" />
                        You get a completely hosted solution and a very fast
                        widget.
                      </ListItem>
                    </List>
                  </Box>
                  <br />
                  <Box>
                    Currently, Loudrr is ONLY supported as React Component which
                    can be used in your own website which is being developed in
                    React. However, other plugins are coming soon. See the
                    status of all the plugins below :
                    <Table
                      variant="simple"
                      size="sm"
                      textAlign="center"
                      marginBlockStart={5}
                    >
                      <TableCaption> Status of {BRAND} widgets</TableCaption>
                      <Thead>
                        <Tr>
                          <Th textAlign="center">Widget</Th>
                          <Th textAlign="center">Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>
                            <Box marginBlockStart={-5}>
                              <TechLogo
                                src="/assets/logo/react.png"
                                title="React"
                                bg="black"
                                size="sm"
                                textColor="black"
                              />
                            </Box>
                          </Td>
                          <Td>
                            <VStack>
                              <Text fontSize="large">😀</Text>
                              <Text marginBlockStart={3}>Available</Text>
                            </VStack>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Box marginBlockStart={-5}>
                              <TechLogo
                                src="/assets/logo/gatsby.png"
                                title="Gatsby"
                                bg="#663399"
                                size="sm"
                                textColor="black"
                              />
                            </Box>
                          </Td>
                          <Td>
                            <VStack>
                              <Text fontSize="larger">🚧</Text>
                              <Text>In Progress</Text>
                            </VStack>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Box marginBlockStart={-5}>
                              <TechLogo
                                src="/assets/logo/squarespace.png"
                                title="Squarespace"
                                bg="black"
                                size="sm"
                                textColor="black"
                              />
                            </Box>
                          </Td>
                          <Td>
                            <VStack>
                              <Text>🚧</Text>
                              <Text>In Progress</Text>
                            </VStack>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Box marginBlockStart={-5}>
                              <TechLogo
                                src="/assets/logo/wordpress.png"
                                title="Wordpress"
                                bg="#15a4cc"
                                size="sm"
                                textColor="black"
                              />
                            </Box>
                          </Td>
                          <Td>
                            <VStack>
                              <Text>🚧</Text>
                              <Text>In Progress</Text>
                            </VStack>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Box marginBlockStart={-5}>
                              <TechLogo
                                src="/assets/logo/shopify.png"
                                title="Shopify"
                                bg="#7ab55c"
                                size="sm"
                                textColor="black"
                              />
                            </Box>
                          </Td>
                          <Td>
                            <VStack>
                              <Text>🚧</Text>
                              <Text>In Progress</Text>
                            </VStack>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
                <Box
                  as="section"
                  id={docData[1].sectionName}
                  textAlign="left"
                  pt={2}
                >
                  <Heading as="h3">{docData[1].sectionTitle}</Heading>
                  <br />
                  Getting Started with {BRAND} is pretty simple. All you need a
                  domain key for a website in which you want to include {BRAND}.
                  <br />
                  <Box my={5}>
                    <OrderedList spacing={3}>
                      <ListItem>
                        <Link as={NextLink} href={"/"}>
                          Signup here
                        </Link>{" "}
                        to register your website and get a new domain key.
                      </ListItem>

                      <ListItem>
                        Once you have the domain key. Simply install our React
                        component using below command.
                        <br />
                        With npm :
                        <br />
                        <CustomCode className="language-bash">
                          {`npm i @loudrr-app/widget 
## OR
yarn add @loudrr-app/widget
`}
                        </CustomCode>
                        <br />
                      </ListItem>
                      <ListItem>
                        <Text>
                          Now that you have all the required ingredients to
                          embed {BRAND} in your website. Include below commands
                          to finally embed {BRAND} in your code.
                        </Text>
                        <CustomCode className="language-jsx">
                          {`import Loudrr from '@loudrr-app/widget;

const domainKey="123gads123-213sada" //a valid domainKey

const Comments: FC<{}> = () => {
    return <Loudrr domainKey={domainKey}/>
}

export default Comments;
`}
                        </CustomCode>
                        <Text>
                          Now this Comments component can be included anywhere
                          in your app.
                        </Text>
                      </ListItem>
                      <ListItem>
                        That is it. We are done. Wasn't it simple. In case you
                        face any issue. Don't forget us to Contact here. We will
                        get back to you within a day. You can also find us on
                        Twitter as @loudrr
                      </ListItem>
                    </OrderedList>
                  </Box>
                </Box>
                <Box as="section" id={docData[2].sectionName} width="full">
                  <Heading>{docData[2].sectionTitle}</Heading>
                  <Box marginBlockStart={2}>
                    <List>
                      <QnA
                        question={
                          <Text as="span" fontWeight="semibold">
                            {" "}
                            When will {BRAND} be available for other platform or
                            as simple js bundle.
                          </Text>
                        }
                        answer={
                          <Text as="span">
                            Our main emphasis is on quality and speed of the
                            commenting widget so we will not rush the components
                            for just the sake of it. But we do understand you
                            needs and expect other platforms to be available in
                            next 2 months. We will soon add a tracker were you
                            will be able to see progress
                          </Text>
                        }
                      />
                      <QnA
                        question={
                          <Text as="span" fontWeight="semibold">
                            Is {BRAND} Free?
                          </Text>
                        }
                        answer={
                          <Text as="span">
                            Yes, for a limited period of time {BRAND} is
                            absolutely free. After this free period ends. You
                            will be limited to maximum of 2 domains per account
                            with maximum of 100 comments per day combined for
                            all the domains/websites. In case you did add more
                            than 2 domains in your account during this free
                            period, you will have those domains lifetime free
                            even after this free period ends.
                          </Text>
                        }
                      />
                    </List>
                  </Box>
                </Box>
                <Box as="section"></Box>
              </VStack>
            </Box>
          </Content>
        </Layout>
      </Layout>
    </Box>
  );
}
