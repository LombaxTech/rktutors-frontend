import "../styles/globals.scss";

import { useEffect } from "react";
import { ChatsProvider } from "../context/ChatsContext";

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
  const { user, userLoading } = useCustomAuth();

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
    <ChatsProvider>
      <ChakraProvider theme={theme}>
        <Head>
          <title>RKTutors</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        {/* Loading */}
        {userLoading && <LoadingPage />}

        {/* No user */}
        {!userLoading && !user && <Component {...pageProps} />}

        {/* User */}
        {!userLoading && user && (
          <div className="max-h-screen min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto flex flex-col">
              <Component {...pageProps} />
            </div>
          </div>
        )}
      </ChakraProvider>
    </ChatsProvider>
  );
}

export default MyApp;
