import { useState, useEffect } from "react";

import {
  Input,
  Select,
  Tag,
  TagLabel,
  TagRightIcon,
  Alert,
  AlertIcon,
  Textarea,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { SmallCloseIcon, DeleteIcon } from "@chakra-ui/icons";

import { db } from "../../firebase/firebaseClient";
import { updateDoc, doc } from "firebase/firestore";
import useCustomAuth from "../../customHooks/useCustomAuth";

const TutoringSubjects = ({ user }) => {
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const removeSubjectFromAccount = async (subject) => {
    console.log(subject);
    try {
      let filteredSubjects = user.profile.teachingSubjects.filter(
        (s) => s !== subject
      );
      console.log(filteredSubjects);
      await updateDoc(doc(db, "users", user.uid), {
        ["profile.teachingSubjects"]: filteredSubjects,
      });
      console.log("removed subject from account...");
    } catch (error) {
      console.log(error);
    }
  };

  const saveSubject = async () => {
    setError(false);
    setSuccess(false);

    if (!subject || !level) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    try {
      const currentlyTeachingSubjects = user.profile.teachingSubjects || [];

      let allSubjects = [...currentlyTeachingSubjects, { subject, level }];
      const uniqueSubjects = [];
      allSubjects.map((x) =>
        uniqueSubjects.filter(
          (a) => a.subject == x.subject && a.level == x.level
        ).length > 0
          ? null
          : uniqueSubjects.push(x)
      );

      // note: if these lengths are equal, then no new subjects are being added
      const oldSubjectBeingAdded =
        currentlyTeachingSubjects.length === uniqueSubjects.length;

      if (!oldSubjectBeingAdded) {
        await updateDoc(doc(db, "users", user.uid), {
          ["profile.teachingSubjects"]: uniqueSubjects,
        });

        console.log("added subject...");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="tutoring-subjects" className="mt-8">
      <h1 className="text-2xl font-semibold mb-2">Subjects You Teach</h1>
      <div className="flex gap-4 flex-wrap my-6">
        {user.profile.teachingSubjects.map((subject, i) => (
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
                onClick={() => removeSubjectFromAccount(subject)}
              >
                <TagRightIcon as={DeleteIcon} />
              </div>
            </Tag>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-10">
        <h1 className="text-lg font-semibold  ">Add more subjects</h1>
        <div className="flex flex-col gap-4 w-6/12">
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
          <button className="btn btn-primary" onClick={saveSubject}>
            Save Subject
          </button>
          {error && (
            <Alert status="error">
              <AlertIcon />
              You must fill in all fields
            </Alert>
          )}
          {success && (
            <Alert status="success">
              <AlertIcon />
              Successfully Saved
            </Alert>
          )}
        </div>
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default TutoringSubjects;
