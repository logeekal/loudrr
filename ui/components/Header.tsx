import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import MenuItem from "./MenuItem";
import MenuToggle from "./Menutoggle";

const Header: React.FC<{}> = (props) => {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  const toggle = () => setIsHeaderMenuOpen(!isHeaderMenuOpen);
  return (
    <Box as="header" w="100%">
      <Flex
        as="nav"
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        wrap="wrap"
        w="99%"
        mb={0}
        p={5}
        bg={"transparent"}
      >
        <Logo />
        <MenuToggle toggle={toggle} isOpen={isHeaderMenuOpen} />
        <Box
          display={{ base: isHeaderMenuOpen ? "block" : "none", md: "block" }}
          flexBasis={{ base: "100%", md: "auto" }}
          justifyContent="flex-end"
        >
          <Menu>
            <MenuItem to="/plans" isLast="false">
              Plans
            </MenuItem>
            <MenuItem to="/faq" isLast={false}>
              FAQ
            </MenuItem>
            <MenuItem to="/about" isLast>
              About
            </MenuItem>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;