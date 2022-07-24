import "../styles/globals.scss";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

import useCustomAuth from "../customHooks/useCustomAuth";
import LoadingPage from "../components/LoadingPage";
import Navbar from "../components/Navbar";

const theme = extendTheme({
  components: {
    Steps,
  },
});

function MyApp({ Component, pageProps }) {
  const { user, loading } = useCustomAuth();

  return (
    <ChakraProvider theme={theme}>
      {/* Loading */}
      {loading && <LoadingPage />}

      {/* No user */}
      {!loading && !user && <Component {...pageProps} />}

      {/* User */}
      {!loading && user && (
        <div className="max-h-screen min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-y-auto flex flex-col">
            <Component {...pageProps} />
          </div>
        </div>
      )}
    </ChakraProvider>
  );
}

export default MyApp;
