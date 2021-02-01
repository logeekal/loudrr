 import "../styles/globals.css";
import { ThemeProvider, CSSReset, ChakraProvider } from "@chakra-ui/react";
import theme from '../theme';
import {Fonts} from '../theme/fonts'


function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <CSSReset/>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
