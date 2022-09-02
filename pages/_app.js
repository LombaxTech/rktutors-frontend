import "../styles/globals.scss";

import { useEffect } from "react";
import { ChatsProvider } from "../context/ChatsContext";
import { AuthProvider } from "../context/AuthContext";
import { BookingsProvider } from "../context/BookingsContext";
import { BookingRequestsProvider } from "../context/BookingRequestsContext";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

import Layout from "../components/Layout";

import Head from "next/head";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

const theme = extendTheme({
  components: {
    Steps,
  },
});

function MyApp({ Component, pageProps }) {
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
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <ChatsProvider>
          <BookingsProvider>
            <BookingRequestsProvider>
              <ChakraProvider theme={theme}>
                <Head>
                  <title>RKTutors</title>
                  <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                  />
                </Head>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ChakraProvider>
            </BookingRequestsProvider>
          </BookingsProvider>
        </ChatsProvider>
      </AuthProvider>
    </Elements>
  );
}

export default MyApp;
