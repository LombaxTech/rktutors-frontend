import "../styles/globals.scss";

import { useEffect } from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

import useCustomAuth from "../customHooks/useCustomAuth";
import LoadingPage from "../components/LoadingPage";
import Navbar from "../components/Navbar";

import Head from "next/head";

const theme = extendTheme({
  components: {
    Steps,
  },
});

function MyApp({ Component, pageProps }) {
  const { user, loading } = useCustomAuth();

  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.setAttribute("id", "threeScript");
    threeScript.setAttribute(
      "src",
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
    );
    document.getElementsByTagName("head")[0].appendChild(threeScript);
    return () => {
      if (threeScript) {
        threeScript.remove();
      }
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>RKTutors</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

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
