import {
  Avatar,
  Box,
  Flex,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem as ChakraMenuItem,
  MenuItemOption,
  MenuList as ChakraMenuList,
  MenuOptionGroup,
  Link,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import MenuItem from "./MenuItem";
import MenuToggle from "./Menutoggle";
import NextLink from "next/link";
import { FiExternalLink } from "react-icons/fi";

import { DataContext } from "./providers/DataProvider";

const Header: React.FC<{}> = (props) => {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  const toggle = () => setIsHeaderMenuOpen(!isHeaderMenuOpen);
  const {
    user: { loggedinUser, logout },
  } = useContext(DataContext);
  return (
    <Box as="header" w="100%">
      <Flex
        as="nav"
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        wrap="wrap"
        w="full"
        mb={0}
        p={5}
        bg={"transparent"}
      >
        <NextLink href="/">
          <Link>
            <Logo />
          </Link>
        </NextLink>
        <MenuToggle toggle={toggle} isOpen={isHeaderMenuOpen} />
        <Box
          display={{ base: isHeaderMenuOpen ? "block" : "none", md: "block" }}
          flexBasis={{ base: "100%", md: "auto" }}
          justifyContent="flex-end"
        >
          <Menu>
            {loggedinUser && (
              <MenuItem to="/dashboard" isLast={false}>
                Dashboard
              </MenuItem>
            )}
            <MenuItem to="/docs" isLast="false">
              Docs
            </MenuItem>
            <MenuItem to="/docs#faq" isLast={false}>
              FAQ
            </MenuItem>
            {!loggedinUser && (
              <MenuItem
                to="https://github.com/logeekal/loudrr"
                isLast
                isExternal={true}
                isNext={false}
              >
                <Text>Github</Text>
              </MenuItem>
            )}
            {loggedinUser && (
              <MenuItem isLast>
                <ChakraMenu>
                  <MenuButton as="button">
                    <Avatar
                      src={loggedinUser.avatar}
                      name={loggedinUser.name}
                      size="sm"
                    ></Avatar>
                  </MenuButton>
                  <ChakraMenuList>
                    <MenuOptionGroup>
                      <ChakraMenuItem>
                        <NextLink href="/dashboard/new">
                          <a>Add new Domain</a>
                        </NextLink>
                      </ChakraMenuItem>
                      <ChakraMenuItem onClick={logout}>Logout</ChakraMenuItem>
                    </MenuOptionGroup>
                  </ChakraMenuList>
                </ChakraMenu>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
