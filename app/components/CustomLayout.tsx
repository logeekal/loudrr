import { Box } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import Header from "./Header";
import { useRouter } from "next/router";
import { AiOutlineVerticalAlignTop } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

export interface CustomLayoutProps {}

export default function CustomLayout({
  children,
}: PropsWithChildren<CustomLayoutProps>) {
  const [windowAvailable, setWindowAvailable] = useState(
    typeof window !== "undefined"
  );

  const [currentScroll, setCurrentScroll] = useState(0);

  const [gotoTopVisible, setGotoTopVisible] = useState(
    windowAvailable ? window.scrollY > 200 : false
  );

  useEffect(() => {
    setWindowAvailable(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (windowAvailable) {
      let handleScroll = () => setCurrentScroll(window.scrollY);
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [windowAvailable]);

  useEffect(() => {
    // console.log(`Current scroll is ${currentScroll} `);
    setGotoTopVisible(currentScroll > 200);
  }, [currentScroll]);

  const router = useRouter();
  return (
    <Box display="grid" placeItems="center" w="99vw">
      <AnimatePresence>
        {gotoTopVisible && (
          <motion.div
            initial={{ transform: "translateY(200px)" }}
            animate={{ transform: "translateY(0px)" }}
            exit={{ transform: "translateY(200px)" }}
            style={{position: "fixed", right: "30px" , bottom: "30px" }}
          >
            <Box
              _hover={{
                cursor: "pointer",
              }}
              onClick={() => {
                windowAvailable && window.scrollTo(window.scrollX, 0);
              }}
              bgColor={"#a485d3"}
              borderRadius="50%"
              padding={3}
              color={"white"}
            >
              <AiOutlineVerticalAlignTop size={50} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <Header />
      <Box
        as="main"
        width="full"
        maxW={router.pathname === "/" ? "full" : "1000px"}
        display="flex"
        flexDir="row"
        justifyContent="center"
        alignItems="flex-start"
        p={5}
      >
        {children}
      </Box>
    </Box>
  );
}
