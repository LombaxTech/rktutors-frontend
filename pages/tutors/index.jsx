import { useState, useEffect, useRef, useContext } from "react";

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
import { AuthContext } from "../../context/AuthContext";

import { smallBigString, getMean } from "../../helperFunctions";
import subjectData from "../../data/subjects.json";
import StarRatings from "react-star-ratings";

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
      <div className="w-4/12 sm:hidden">
        <img src="img/user-profiles.svg" alt="" className="h-56" />
      </div>
      {/* Title and Filter */}
      <div className="w-6/12 flex flex-col sm:w-full">
        <h1 className="text-5xl font-bold text-center">Find a Tutor </h1>
        <hr className="my-6 sm:my-1" />

        {/* Filter */}
        <div className="flex gap-4 mt-8 w-full sm:flex-col">
          <div className="flex gap-4 flex-1 sm:w-10/12 sm:flex-col sm:mx-auto">
            <select
              className="flex-1 select max-w-xs outline text-center"
              // value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option disabled selected className="text-center">
                Subject
              </option>
              {subjectData.subjects.map((subject) => (
                <option value={subject} key={subject}>
                  {subject}
                </option>
              ))}
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
    <div className="flex-1 p-8 bg-gray-200 sm:p-0">
      <div className="bg-white rounded-md shadow-md p-8">
        <ImageAndFilter
          setSearchedSubject={setSearchedSubject}
          setSearchedAcademicLevel={setSearchedAcademicLevel}
        />
        <hr className="my-12" />
        <div className="flex items-center gap-6 justify-center my-8">
          <h1
            className="text-4xl font-bold underline text-center"
            ref={tutorsRef}
          >
            {" "}
            {(!searchedSubject || !searchedAcademicLevel) && "Our Tutors"}
            {setSearchedAcademicLevel && searchedSubject && (
              <div>
                {searchedAcademicLevel}{" "}
                <span className="text-teal-500">{searchedSubject}</span> Tutors
              </div>
            )}
            {/* <span className="text-blue-700">Physics</span> Tutors */}
          </h1>
          <div className="flex flex-col ml-10 p-8 border-2 rounded-md  w-fit">
            <div className="flex gap-4 items-center">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <div className="">GCSE</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <div className="">A-Level</div>
            </div>
          </div>
        </div>
        {/* color key */}
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
  const { user } = useContext(AuthContext);

  let ratingNumbers = tutor.ratings?.map((r) => r.rating);
  const tutorRating = ratingNumbers.length === 0 ? 0 : getMean(ratingNumbers);

  return (
    <Box
      maxW={"440px"}
      w={"full"}
      bg="white"
      boxShadow={"xl"}
      rounded={"md"}
      p={6}
      textAlign={"center"}
      display={"flex"}
      flexDirection="column"
      border={"1px"}
      borderColor={"gray.200"}
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
        <div className="flex justify-center">
          {ratingNumbers.length === 0 ? (
            <div className="flex items-center gap-2 font-bold text-sm text-teal-500">
              NEW Tutor
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <StarRatings
                rating={tutorRating}
                starRatedColor="gold"
                starDimension={"20px"}
                starSpacing={"2px"}
              />
              <span className="">
                ({ratingNumbers.length} Review
                {ratingNumbers.length === 1 ? "" : "s"})
              </span>
            </div>
          )}
        </div>
        <div className="text-center">
          <span className="font-bold text-lg mr-1">
            £{tutor.lessonPrices["GCSE"]}
          </span>
          per lesson
        </div>

        {/* <Stack align={"center"} justify={"center"} direction={"row"} my={4}> */}

        <div className="flex gap-1 justify-center flex-wrap my-4 overflow-x-auto">
          {tutor.profile.teachingSubjects &&
            tutor.profile.teachingSubjects.map((subject, i) => (
              <Tag
                size={"sm"}
                variant="solid"
                colorScheme={subject.level === "GCSE" ? "green" : "blue"}
                key={i}
                className="p-2"
              >
                {`${subject.subject}`}
              </Tag>
            ))}
        </div>
        {/* </Stack> */}
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
