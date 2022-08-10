import { useState, useEffect } from "react";

import {
  Textarea,
  TagLabel,
  TagRightIcon,
  Tag,
  Select,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { SmallCloseIcon, DeleteIcon } from "@chakra-ui/icons";

import useCustomAuth from "../customHooks/useCustomAuth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseClient";
import { useRouter } from "next/router";

export default function ProfileSetup() {
  const router = useRouter();
  const { user, userLoading } = useCustomAuth();

  const [aboutMe, setAboutMe] = useState("");
  const [aboutMyLessons, setAboutMyLessons] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const addSubjectAndLevel = async () => {
    const subjectExist = subjects.some(
      (s) => s.subject === subject && s.level === level
    );

    if (!subjectExist) {
      setSubjects([...subjects, { subject, level }]);
    }
  };

  const removeSubject = (subject) => {
    let filteredSubjects = subjects.filter((s) => s !== subject);
    setSubjects(filteredSubjects);
  };

  const finish = async () => {
    setError(false);
    setSuccess(false);
    try {
      //   todo: get unique subjects (since this should be first time tutor is doing this, shouldnt actually need to make unique)
      const currentlyTeachingSubjects = user.profile.teachingSubjects || [];
      let allSubjects = [...currentlyTeachingSubjects, ...subjects];
      const uniqueSubjects = [];
      allSubjects.map((x) =>
        uniqueSubjects.filter(
          (a) => a.subject == x.subject && a.level == x.level
        ).length > 0
          ? null
          : uniqueSubjects.push(x)
      );

      if (uniqueSubjects.length === 0 || !aboutMe || !aboutMyLessons)
        return setError(true);

      // note: uniqueSubjects now contains unique subjects new and those already saved in the users account
      const stripeAndGoogleActive =
        user.googleAccount.setup && user.stripeConnectedAccount.setup;

      const updateDetails = {
        ...(stripeAndGoogleActive && { active: true }),
        profile: {
          setup: true,
          teachingSubjects: uniqueSubjects,
          aboutMe,
          aboutMyLessons,
        },
        // [`profile.setup`]: false,
        // [`profile.secret.age`]: 19,
      };

      await updateDoc(doc(db, "users", user.uid), updateDetails);
      console.log("updated user...");
      setSuccess(true);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (user && user.type === "tutor")
    return (
      <div className="bg-gray-200 flex-1 p-8 flex">
        <div className="bg-white rounded-md shadow-md p-8 flex-1 flex flex-col">
          <div className="flex gap-4 justify-between">
            {/* Title and fields */}
            <div className="w-6/12 flex flex-col gap-6">
              <h1 className="text-4xl font-bold">Profile Setup</h1>
              <hr className="" />
              {/* Add Subjects */}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold ml-4">
                  Choose Subjects to Teach
                </h1>
                {/* llllll */}
                <div className="flex gap-4">
                  <Select
                    placeholder="Select Subject"
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Mathematics">Math</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                  </Select>
                  <Select
                    placeholder="Select Level"
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="GCSE">GCSE</option>
                    <option value="A-Level">A-Level</option>
                  </Select>
                  <button
                    className="btn btn-primary"
                    onClick={addSubjectAndLevel}
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-4 flex-wrap my-6">
                  {subjects.map((subject, i) => (
                    <div key={i}>
                      <Tag
                        variant="outline"
                        // colorScheme="blue"
                      >
                        <TagLabel>
                          {subject.subject} {subject.level}
                        </TagLabel>
                        <div
                          className="cursor-pointer"
                          onClick={() => removeSubject(subject)}
                        >
                          <TagRightIcon as={DeleteIcon} />
                        </div>
                      </Tag>
                    </div>
                  ))}
                </div>

                {/* llllll */}
              </div>
              {/* About Me */}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold ml-4">About Me</h1>
                <Textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  placeholder="Write a bit about yourself"
                  size="sm"
                />
              </div>
              {/* About My Lessons */}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold ml-4">About My Lessons</h1>
                <Textarea
                  value={aboutMyLessons}
                  onChange={(e) => setAboutMyLessons(e.target.value)}
                  placeholder="Write a bit about your lessons"
                  size="sm"
                />
              </div>
              <div className="">
                <button className="btn btn-primary" onClick={finish}>
                  Save and Finish
                </button>
              </div>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  You must fill in all fields
                </Alert>
              )}
              {success && (
                <Alert status="success">
                  <AlertIcon />
                  Profile updated! You will be redirected shortly
                </Alert>
              )}
            </div>

            {/* Image */}
            <div className="w-5/12">
              <img src="img/profile.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    );
}
