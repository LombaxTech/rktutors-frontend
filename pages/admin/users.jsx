import { useEffect, useState, useContext } from "react";
import useAdminRedirect from "../../customHooks/useAdminRedirect";
import { AuthContext } from "../../context/AuthContext";

import { db } from "../../firebase/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

import { Avatar, Select } from "@chakra-ui/react";
import Link from "next/link";
import { smallBigString } from "../../helperFunctions";

import subjectData from "../../data/subjects.json";

export default function Users() {
  const { redirectLoading } = useAdminRedirect();
  const [users, setUsers] = useState([]);
  const { user: admin } = useContext(AuthContext);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    async function init() {
      try {
        let usersSnapshot = await getDocs(collection(db, "users"));

        let users = [];
        usersSnapshot.forEach((user) =>
          users.push({ id: user.id, ...user.data() })
        );
        console.log(users);
        setUsers(users);
        setFilteredUsers(users);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  useEffect(() => {
    // console.log(`${subject level}`);

    if (!subject || !level) return setFilteredUsers(users);

    let filteredTutors = users.filter((u) => {
      let exists = false;

      if (u.type !== "tutor") return false;
      if (!u.profile?.teachingSubjects) return false;

      const teachingSubjects = u.profile?.teachingSubjects;
      teachingSubjects.forEach((s) => {
        if (s.level === level && s.subject === subject) {
          exists = true;
        }
      });

      if (exists) return true;
    });

    setFilteredUsers(filteredTutors);
  }, [subject, level]);

  useEffect(() => {
    if (!userType) return setFilteredUsers(users);
    let filteredUsers = users.filter((user) => user.type === userType);
    setFilteredUsers(filteredUsers);
  }, [userType]);

  const clearFields = () => {
    setSubject("");
    setLevel("");
    setUserType("");
  };

  if (redirectLoading) return <div className="">Nothing to see...</div>;

  return (
    <div className="flex-1 p-4 bg-gray-200 flex">
      <div className="flex-1 flex flex-col bg-white rounded-md shadow-md p-4">
        <h1 className="text-2xl font-bold">All Users</h1>
        <div className="flex items-center my-4">
          <Select
            placeholder="Select Subject"
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjectData.subjects.map((subject) => (
              <option value={subject} key={subject}>
                {subject}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Level"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="GCSE">GCSE</option>
            <option value="A-Level">A-Level</option>
          </Select>
          <Select
            placeholder="User Type"
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="student">student</option>
            <option value="tutor">tutor</option>
          </Select>
          <button className="btn btn-warning" onClick={clearFields}>
            Clear
          </button>
        </div>
        <FilterByName
          users={users}
          filteredUsers={filteredUsers}
          setFilteredUsers={setFilteredUsers}
        />
        {filteredUsers &&
          filteredUsers.map((user) => (
            <User user={user} admin={admin} key={user.id} />
          ))}
      </div>
    </div>
  );
}

const FilterByName = ({ users, filteredUsers, setFilteredUsers }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!name) return setFilteredUsers(users);

    let filteredUsers = users.filter((user) =>
      user.fullName.toLowerCase().includes(name.toLowerCase())
    );

    setFilteredUsers(filteredUsers);
  }, [name]);

  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        placeholder="search by name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 border"
      />
      {/* <button className="btn btn-warning" onClick={searchName}>
        Search
      </button> */}
      <button
        className="btn btn-warning"
        onClick={() => {
          setName("");
          setFilteredUsers(users);
        }}
      >
        Clear
      </button>
    </div>
  );
};

const User = ({ user, admin }) => {
  const { fullName, profilePictureUrl, type } = user;

  return (
    <div className="p-4 flex gap-2 items-center border">
      <div className="flex flex-col gap-2 items-center w-2/12 border-r">
        <Avatar name={fullName} src={profilePictureUrl} />
        <h2 className="font-semibold text-xl">{fullName}</h2>
      </div>
      <div className="w-1/12 px-2">
        <h2 className="font-semibold text-xl">{type}</h2>
      </div>
      <Link
        href={`/chats/${smallBigString(user.id, admin.uid)}?partnerId=${
          user.id
        }`}
      >
        <button className="btn btn-primary">Message</button>
      </Link>

      {type === "tutor" &&
        user.profile?.teachingSubjects.map((s, i) => (
          <div className="font-bold" key={i}>{`${s.subject} ${s.level}`}</div>
        ))}
    </div>
  );
};
