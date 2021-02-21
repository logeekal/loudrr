import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Divider,
  Stack,
  Box,
  AccordionIcon,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../components/providers/DataProvider";
import APIService from "../service/service";
import Thread from "../components/Thread";
import { IDomain, PageExtended, UsersObjType } from "../utils/types";
import Header from "../components/Header";

export interface DomainProps {
  domain: IDomain;
}

export default function DomainPage(props: DomainProps) {
  const {
    comments: { page, loadParents, loadChildren, thread },
    domain: { domain, setDomain },
  } = useContext(DataContext);

  const pages = Object.keys(page);
  const [expandedItems, setExpandedItems] = useState(
    Array(pages.length).fill(null)
  );

  useEffect(() => {
    setDomain(props.domain);
  }, []);

  useEffect(() => {
    setExpandedItems(pages.map((page, index) => index));

    let timeout = setTimeout(() => {
      setExpandedItems(Array(pages.length).fill(null));
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [thread]);

  return (
    <Box className="domain-page" w="full">
      <Head>
        <title>{props.domain.address} Dashboard</title>
      </Head>
      <Stack direction="column" className="all-pages">
        <Accordion allowToggle allowMultiple w="full">
          {Object.keys(page).map((currentPageKey) => {
            const currentPage = page[currentPageKey];
            return (
              <AccordionItem
                key={currentPageKey}
                borderWidth={1}
                boxShadow={"sm"}
              >
                <AccordionButton>
                  <Stack
                    direction="row"
                    className="page-head"
                    justify="space-between"
                    w="full"
                    px={2}
                  >
                    <Box>{`${currentPage.pageTitle}(${currentPage.pageLocation})`}</Box>
                    <Box>{`${currentPage.childrenComments.length} Comments`}</Box>
                  </Stack>

                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Thread
                    domainKey={domain.key}
                    parentComments={currentPage.childrenComments}
                  />
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Stack>
    </Box>
  );
}

export async function getServerSideProps(context) {
  /**
   * Every Page needs
   *
   * 1. Complete Provider Data
   * 2.
   */
  console.log(context.req.__NEXT_INIT_QUERY);
  const { key } = context.req.__NEXT_INIT_QUERY;
  const result = {};

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

    const { domain, pageCount, commentCount } = userDomains.data;

    const currentDomain = domain.find(
      (currentDomain) => currentDomain.key === key
    );

    console.log(`Opening Dashboard for : `, currentDomain);

    return {
      props: {
        domain: currentDomain,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}


import { Amplify } from "aws-amplify";
import awsExports from '../aws-exports'
Amplify.configure({...awsExports, ssr: true });
