import { Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

const MenuItem = ({ children, isLast, to=undefined, ...rest }) => {
  if (!to) {
   return <Text display="block" {...rest}>
      {children}
    </Text>;
  }
  else
  return (
    <NextLink href={to}>
      <Link>
        <Text display="block" {...rest}>
          {children}
        </Text>
      </Link>
    </NextLink>
  );
};

export default MenuItem;
