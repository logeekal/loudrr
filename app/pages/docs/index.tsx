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
} from "@chakra-ui/react";
import { Layout } from "antd";
import Head from "next/head";
import Router from "next/router";
import { MdCheckCircle, MdLink } from "react-icons/md";
import TechLogo from "../../components/TechLogo";

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
    sectionName: "getting-started",
    sectionTitle: "Getting Started",
  },
  {
    sectionName: "about",
    sectionTitle: "About",
    sectionLink: "#about",
  },
  {
    sectionName: "about",
    sectionTitle: "About",
    sectionLink: "#about",
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
                    Congratualtions on reaching the documentation page of{" "}
                    {BRAND}. Since, you are here, we assume you know what Loudrr
                    is and we will explain how you can use {BRAND} in your own
                    app. Honestly, there is not much to explain. IT IS PRETTY
                    EASY.
                  </Text>
                  <br />
                  <Text>
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
                        widget
                      </ListItem>
                    </List>
                  </Text>
                  <br />
                  <Text>
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
                              <Text marginBlockStart={2}>Available</Text>
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
                  </Text>
                </Box>
                <Box
                  as="section"
                  id={"getting-started"}
                  textAlign="left"
                  pt={2}
                >
                  <Heading as="h3">Getting Started</Heading>
                </Box>
                <Box as="section"></Box>
                <Box as="section"></Box>
              </VStack>
            </Box>
          </Content>
        </Layout>
      </Layout>
    </Box>
  );
}
