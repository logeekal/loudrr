import { Box, Button, Code, GlobalStyle, useClipboard } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Prism from 'prismjs'
global.Prism = Prism


export default function CustomCode({ children, ...restProps }) {
  const { hasCopied, onCopy } = useClipboard(children);
   useEffect(() => {
    Prism.highlightAll();
  }, []);
 return (
    <Box position="relative">
      <Button
        variant="solid"
        position="absolute"
        right={0}
        top={0}
        borderRadius={0}
        onClick={onCopy}
      >
        {hasCopied ? "Copied" : "Copy"}
      </Button>
      <pre>
        <code {...restProps}>{children}</code>
      </pre>
    </Box>
  );
}
