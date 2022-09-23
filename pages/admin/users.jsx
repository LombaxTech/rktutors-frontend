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

import { Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { smallBigString } from "../../helperFunctions";

export default function Users() {
  const { redirectLoading } = useAdminRedirect();
  const [users, setUsers] = useState([]);
  const { user: admin } = useContext(AuthContext);

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
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  if (redirectLoading) return <div className="">Nothing to see...</div>;

  return (
    <div className="flex-1 p-4 bg-gray-200 flex">
      <div className="flex-1 flex flex-col bg-white rounded-md shadow-md p-4">
        <h1 className="text-2xl font-bold">All Users</h1>
        {users &&
          users.map((user) => <User user={user} admin={admin} key={user.id} />)}
      </div>
    </div>
  );
}

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
    </div>
  );
};
