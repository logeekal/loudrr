import { Box } from "@chakra-ui/react";
import React from "react";
import { MdClose, MdMenu } from "react-icons/md";

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <MdClose /> : <MdMenu />}
    </Box>
  );
};

export default MenuToggle;
