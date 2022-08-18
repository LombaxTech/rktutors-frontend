import { useState, useEffect, useRef } from "react";

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
  Tag,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseClient";

import Link from "next/link";
import useCustomAuth from "../../customHooks/useCustomAuth";
import { smallBigString } from "../../helperFunctions";

const ImageAndFilter = ({ setSearchedSubject, setSearchedAcademicLevel }) => {
  const [subject, setSubject] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [error, setError] = useState(false);

  const search = () => {
    console.log(subject, academicLevel);
    setError(false);
    if (!subject || !academicLevel) {
      console.log("you are missing something..");
      setError(true);
      setTimeout(() => setError(false), 8000);
    } else {
      setSearchedSubject(subject);
      setSearchedAcademicLevel(academicLevel);
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
              <option>A-Level</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={search}>
            Search
          </button>
        </div>
        {error && (
          <Alert status="warning" className="mt-4 w-3/4 mx-auto text-center">
            <AlertIcon />
            You must select a subject and an academic level
          </Alert>
        )}
      </div>
    </div>
  );
};

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);

  const [searchedSubject, setSearchedSubject] = useState("");
  const [searchedAcademicLevel, setSearchedAcademicLevel] = useState("");

  const tutorsRef = useRef(null);

  useEffect(() => {
    async function init() {
      try {
        const usersRef = collection(db, "users");
        const tutorsRef = query(
          usersRef,
          where("type", "==", "tutor"),
          where("active", "==", true)
        );

        let tutorsSnapshot = await getDocs(tutorsRef);

        let tutors = [];

        tutorsSnapshot.forEach((tutorDoc) =>
          tutors.push({ id: tutorDoc.id, ...tutorDoc.data() })
        );

        setTutors(tutors);
        setFilteredTutors(tutors);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  useEffect(() => {
    console.log(searchedAcademicLevel, searchedSubject);

    if (searchedSubject && searchedAcademicLevel && tutors) {
      let filteredTutors = tutors.filter((tutor) => {
        let exists = false;

        if (!tutor.profile.teachingSubjects) return false;

        const teachingSubjects = tutor.profile.teachingSubjects;
        teachingSubjects.forEach((subject) => {
          if (
            subject.level === searchedAcademicLevel &&
            subject.subject === searchedSubject
          ) {
            exists = true;
          }
        });

        if (exists) return true;
      });

      setFilteredTutors(filteredTutors);
      console.log(filteredTutors);
      tutorsRef.current?.scrollIntoView();
    }
  }, [searchedSubject, searchedAcademicLevel]);

  return (
    <div className="flex-1 p-8 bg-gray-200">
      <div className="bg-white rounded-md shadow-md p-8">
        <ImageAndFilter
          setSearchedSubject={setSearchedSubject}
          setSearchedAcademicLevel={setSearchedAcademicLevel}
        />

        <hr className="my-12" />
        <h1
          className="text-4xl font-bold underline my-8 text-center"
          ref={tutorsRef}
        >
          {" "}
          {(!searchedSubject || !searchedAcademicLevel) && "Our Tutors"}
          {setSearchedAcademicLevel && searchedSubject && (
            <div>
              {searchedAcademicLevel}{" "}
              <span className="text-blue-700">{searchedSubject}</span> Tutors
            </div>
          )}
          {/* <span className="text-blue-700">Physics</span> Tutors */}
        </h1>
        {/* tutor profiles */}
        <div className="flex gap-8 flex-wrap justify-center">
          {filteredTutors &&
            filteredTutors.map((tutor, i) => (
              <TutorProfile tutor={tutor} key={i} />
            ))}
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
      bg="white"
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
          {tutor.profile.teachingSubjects &&
            tutor.profile.teachingSubjects.map((subject, i) => (
              <Tag
                size={"md"}
                variant="solid"
                colorScheme="blue"
                key={i}
                className="p-2"
              >
                {`${subject.subject} ${subject.level}`}
              </Tag>
            ))}
        </Stack>
        <Text textAlign={"center"} bg={"white"} px={3}>
          {tutor.profile.aboutMe}
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
              rounded={"md"}
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
            rounded={"md"}
            bg={"blue.400"}
            color={"white"}
            // boxShadow={
            //   "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            // }
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
