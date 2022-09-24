import { useState, useEffect } from "react";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  IconButton,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import { firebaseApp } from "../firebase/firebaseClient";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { useRouter } from "next/router";

const auth = getAuth(firebaseApp);

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const login = async () => {
    setErrorMessage("");

    try {
      console.log("logging in...");
      console.log(email, password, rememberMeChecked);

      if (!rememberMeChecked) {
        await setPersistence(auth, browserSessionPersistence);
      }

      let res = await signInWithEmailAndPassword(auth, email, password);
      console.log("signed in");

      router.push("/");
    } catch (error) {
      console.log(error);
      setErrorMessage("Incorrect email or password");
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"} background={""}>
          <div className="flex items-center gap-8">
            <IconButton
              vairant="solid"
              bg={"linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)"}
              color={"white"}
              weight="bold"
              icon={<ArrowBackIcon weight="bold" />}
              onClick={() => router.push("/")}
            />
            <Heading fontSize={"4xl"}>Log in</Heading>
          </div>
        </Stack>
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox
                  isChecked={rememberMeChecked}
                  onChange={(e) => setRememberMeChecked(e.target.checked)}
                >
                  Remember me
                </Checkbox>
                <Link color={"blue.400"} href="/resetpassword">
                  Forgot password?
                </Link>
              </Stack>
              <Button
                bg={"linear-gradient(to right, #5ca9fb 0%, #38b2ac 100%)"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={login}
              >
                Sign in
              </Button>
              <Link color={"blue.400"} href="/signup">
                Create a new account
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
