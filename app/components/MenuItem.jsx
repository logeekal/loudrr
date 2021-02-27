import { HStack, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

const MenuItem = ({
  children,
  isLast,
  to = undefined,
  isExternal = false,
  isNext = true,
  ...rest
}) => {
  if (!to) {
    return (
      <Text display="block" {...rest}>
        {children}
      </Text>
    );
  } else if (isNext) {
    return (
      <NextLink href={to}>
        <Link isExternal={isExternal}>
          <Text display="block" {...rest}>
            {children}
          </Text>
        </Link>
      </NextLink>
    );
  } else {
    return (
      <Link href={to} isExternal={isExternal}>
        <HStack display="inline-block" {...rest}>
          {children}
        </HStack>
      </Link>
    );
  }
};

export default MenuItem;
