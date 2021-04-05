import { Box as Flex, MenuItem, Stack } from "@chakra-ui/react";
import React from "react";
import Logo from "./Logo";

const Menu = ({ children }) => {
  return (
         <Stack
        spacing={8}
        align={["flex-end", "flex-end","center","center"]}
        justify={["flex-end", "flex-end", "flex-end", "flex-end"]}
        direction={["column", "column", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        {children}
      </Stack>
  );
};

export default Menu;
