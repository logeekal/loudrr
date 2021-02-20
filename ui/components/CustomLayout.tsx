import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Header from "./Header";
import { useRouter } from 'next/router';

export interface CustomLayoutProps {}

export default function CustomLayout({
  children,
}: PropsWithChildren<CustomLayoutProps>) {

  const router = useRouter();
  return (
    <Box display="grid" placeItems="center" w="99vw">
      <Header />
      <Box
        as="main"
        width="full"
        maxW={router.pathname === '/' ? "full" :"1000px"}
        display="flex"
        flexDir="row"
        justifyContent="center"
        alignItems="flex-start"
        p={10}
      >
        {children}
      </Box>
    </Box>
  );
}
