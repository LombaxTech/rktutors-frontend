import { useState, useEffect } from "react";

import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseClient";

import Link from "next/link";
import useCustomAuth from "../../customHooks/useCustomAuth";
import { smallBigString } from "../../helperFunctions";

const ImageAndFilter = () => {
  const [subject, setSubject] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");

  const search = () => {
    console.log(subject, academicLevel);
    if (!subject || !academicLevel) {
      console.log("you are missing something..");
    }
  };

  return (
    <div className="flex gap-6 justify-around">
      {/* Image */}
      <div className="w-4/12">
        <img src="img/user-profiles.svg" alt="" className="h-56" />
      </div>
      {/* Title and Filter */}
      <div className="w-6/12 flex flex-col">
        <h1 className="text-5xl font-bold text-center">Find a Tutor </h1>
        <hr className="my-6" />

        {/* Filter */}
        <div className="flex gap-4 mt-8 w-full">
          <div className="flex gap-4 flex-1">
            <select
              className="flex-1 select max-w-xs outline text-center"
              // value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option disabled selected className="text-center">
                Subject
              </option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
              <option>English Language</option>
              <option>English Literature</option>
            </select>

            <select
              className="flex-1 select max-w-xs outline text-center"
              // value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value)}
            >
              <option disabled selected className="text-center">
                Academic Level
              </option>
              <option>GCSE</option>
              <option>A Level</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={search}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Tutors() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const usersRef = collection(db, "users");
        const tutorsRef = query(usersRef, where("type", "==", "tutor"));

        let tutorsSnapshot = await getDocs(tutorsRef);

        let tutors = [];

        tutorsSnapshot.forEach((tutorDoc) =>
          tutors.push({ id: tutorDoc.id, ...tutorDoc.data() })
        );

        setTutors(tutors);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  return (
    <div className="flex-1 p-8 bg-gray-200">
      <div className="bg-white rounded-md shadow-md p-8">
        <ImageAndFilter />
        <hr className="my-12" />
        <h1 className="text-4xl font-bold underline my-8 text-center">
          {" "}
          A Level <span className="text-blue-700">Physics</span> Tutors
        </h1>
        {/* tutor profiles */}
        <div className="flex gap-8 flex-wrap justify-center">
          {tutors && tutors.map((tutor) => <TutorProfile tutor={tutor} />)}
        </div>
      </div>
    </div>
  );
}

function TutorProfile({ tutor }) {
  const { user } = useCustomAuth();

  return (
    <Box
      maxW={"320px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"xl"}
      rounded={"md"}
      p={6}
      textAlign={"center"}
      display={"flex"}
      flexDirection="column"
    >
      <div className="flex-1">
        <Avatar
          size={"xl"}
          src={tutor.profilePictureUrl}
          alt={"Avatar Alt"}
          mb={4}
        />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {tutor.fullName}
        </Heading>

        <Stack align={"center"} justify={"center"} direction={"row"} my={4}>
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue("gray.50", "gray.800")}
            fontWeight={"400"}
          >
            Math A Level
          </Badge>
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue("gray.50", "gray.800")}
            fontWeight={"400"}
          >
            Math GCSE
          </Badge>
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue("gray.50", "gray.800")}
            fontWeight={"400"}
          >
            Physics GCSE
          </Badge>
        </Stack>
        <Text
          textAlign={"center"}
          color={useColorModeValue("gray.700", "gray.400")}
          px={3}
        >
          Actress, musician, songwriter and artist. PM for work inquires or me
          in your posts
        </Text>
      </div>

      <Stack mt={8} direction={"row"} spacing={4}>
        {user && (
          <Link
            href={`/chats/${smallBigString(user.uid, tutor.id)}/?partnerId=${
              tutor.id
            }`}
          >
            <Button
              flex={1}
              fontSize={"sm"}
              rounded={"full"}
              _focus={{
                bg: "gray.200",
              }}
            >
              Message
            </Button>
          </Link>
        )}

        <Link href={`/tutors/${tutor.id}`}>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            bg={"blue.400"}
            color={"white"}
            boxShadow={
              "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            }
            _hover={{
              bg: "blue.500",
            }}
            _focus={{
              bg: "blue.500",
            }}
          >
            Visit Profile
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
