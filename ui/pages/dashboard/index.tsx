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
  useClipboard,
  Stack,
  Badge,
  Select,
} from "@chakra-ui/react";
import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import APIService from "../../service/API";
import { DOMAIN_CREATION_STATUS, REQUEST_STATES } from "../../utils/constants";
import { IDomain, DomainExtended, User } from "../../utils/types";
import { ImFileEmpty } from "react-icons/im";
import { MdHourglassEmpty } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";
import Header from "../../components/Header";

export interface DashboardProps {
  domains: Array<DomainExtended>;
  user: User;
}

export default function DashBoard(props: DashboardProps) {
  const [areDomainsActive, setAreDomainsActive] = useState(
    props["domains"].length !== 0
  );

  const toast = useToast();
  const [requestState, setRequestState] = useState(REQUEST_STATES.IDLE);
  const [domain, setDomain] = useState("");
  const [domainData, setDomainData] = useState<IDomain>({});
  const [domainCreationStatus, setDomainCreationStatus] = useState(
    DOMAIN_CREATION_STATUS.NOT_STARTED
  );

  const [selectedDomainIdx, setSelectedDomainIdx] = useState(0);

  const { onCopy, hasCopied } = useClipboard(domainData.key);

  const handleDomainCreation = async (e) => {
    e.preventDefault();
    console.log(domainCreationStatus);
    if (domainCreationStatus === DOMAIN_CREATION_STATUS.COMPLETE) {
      Router.reload();
      return;
    }
    setRequestState(REQUEST_STATES.PENDING);
    try {
      const createdDomain = await APIService.createDomain(domain,{});
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

  const redirectToNewDomain = () => {
    if(typeof window !== 'undefined'){
      window.location.href='/dashboard/new'
    }else{
      Router.push('/dashboard/new')
    }
  }


  const selectedDomain = props.domains[selectedDomainIdx];
  return (
    <Box className="dashboard-page" w="full">
      <Head>
        <title>
          { `Dashboard - ${props.user.name}`}
        </title>
      </Head>
      {!areDomainsActive ? redirectToNewDomain() : (
        <Box
          className="dashboard-content"
          maxW="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Stack direction="column" w="full" maxW="800px">
            <Stack direction="column">
              <Flex
                className="domain-head"
                justifyContent="space-between"
                alignItems="center"
              >
                <Select
                  onChange={(e) =>
                    setSelectedDomainIdx(parseInt(e.target.value))
                  }
                  defaultValue={selectedDomainIdx}
                  maxW={"300px"}
                >
                  {props.domains.map((domain, index) => {
                    console.log(domain);
                    const { onCopy, hasCopied } = useClipboard(domain.key);
                    return (
                      <option key={domain.key} value={index}>
                        {domain.address}
                      </option>
                    );
                  })}
                </Select>
                <Stack direction="row" alignItems="center" spacing={5}>
                  <Button onClick={onCopy}>
                    {hasCopied ? "Copied" : "Copy Key"}
                  </Button>
                  <Badge
                    className={`badge-${selectedDomain.status.toLowerCase()}`}
                    colorScheme={
                      selectedDomain.status === "ACTIVE" ? "green" : "red"
                    }
                    variant={
                      selectedDomain.status === "INACTIVE" ? "red" : "green"
                    }
                  >
                    {selectedDomain.status}
                  </Badge>
                </Stack>
              </Flex>
              <Divider marginBlock={10} />
              <Stack
                direction="row"
                className="domain-content"
                spacing={10}
                justifyContent="center"
                alignItems="center"
                my={10}
              >
                <Link href={selectedDomain.pageCount > 0 ? `/website?key=${selectedDomain.key}`: `#`}>
                  <Stack
                    p={10}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    boxShadow="sm"
                    width="full"
                    borderWidth={1}
                    color="#862cb3"
                    _hover={{
                      cursor: "pointer",
                    }}
                  >
                    <ImFileEmpty size={50} color="#d7c2e8" />
                    <Box as="h3">
                      {selectedDomain.pageCount || "No" + " Pages"}
                    </Box>
                  </Stack>
                </Link>
                <Link href={selectedDomain.pageCount > 0 ? `/website?key=${selectedDomain.key}`: "#"}>
                  <Stack
                    p="10"
                    direction="column"
                    width="full"
                    justifyContent="center"
                    alignItems="center"
                    boxShadow="sm"
                    borderWidth={1}
                    color="#862cb3"
                    _hover={{
                      cursor: "pointer",
                    }}
                  >
                    <AiOutlineMessage size={50} color="#d7c2e8" />
                    <Box as="h3">
                      {selectedDomain.commentCount || "No" + " Comments"}
                    </Box>
                  </Stack>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      )}
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
    const userDomains = await APIService.getDomains({
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    });

    const { domain, pageCount, commentCount } = userDomains.data;

    let domainExtended: Array<DomainExtended>;

    if(domain && domain.length > 0){
    domainExtended = domain.map((dom, index) => {
      return {
        ...dom,
        pageCount: pageCount[index],
        commentCount: commentCount[index],
      };
    });

    domainExtended.sort((a, b) => b.commentCount - a.commentCount);

    console.log({ sortedDomain: domainExtended });


    }
    
    result["domains"] = domainExtended || [];
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
