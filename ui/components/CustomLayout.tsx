import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Header from "./Header";

export interface CustomLayoutProps {}

export default function CustomLayout({
  children,
}: PropsWithChildren<CustomLayoutProps>) {
  return (
    <Box display="grid" placeItems="center" w="99vw">
      <Header />
      <Box
        as="main"
        width="full"
        maxW={"1000px"}
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
