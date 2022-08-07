import React, { useState, useEffect } from "react";

import { Avatar } from "@chakra-ui/react";

import { db } from "../../firebase/firebaseClient";
import { onSnapshot, query, where, collection } from "firebase/firestore";

import useCustomAuth from "../../customHooks/useCustomAuth";
import { smallBigString, isToday } from "../../helperFunctions";

import Link from "next/link";
import { DateTime } from "luxon";

export default function Chats() {
  const { user, userLoading } = useCustomAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        let chatsRef = query(
          collection(db, "chats"),
          where("userIds", "array-contains", user.uid)
        );

        onSnapshot(chatsRef, (chatsSnapshot) => {
          let chats = [];

          chatsSnapshot.forEach((chatDoc) => {
            chats.push({ id: chatDoc.id, ...chatDoc.data() });
          });

          console.log(chats);
          setChats(chats);
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (!userLoading && user) {
      init();
    }
  }, [user, userLoading]);

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold text-center">Messages</h1>
      <hr className="mt-8" />
      {/* Chats */}
      <div className="flex flex-col items-center mt-4 w-7/12 shadow-md mx-auto">
        {chats.length === 0 && <NoChats />}
        {chats && user && chats.map((chat) => <Chat chat={chat} user={user} />)}
      </div>
    </div>
  );
}

const NoChats = () => <div>No chats available</div>;

const Chat = ({ chat, user }) => {
  const lastMessage = chat.lastMessage.text;
  const partner = chat.users.filter((chatUser) => chatUser.id !== user.uid)[0];
  const readChat = chat.read[user.uid];

  const sentAt = chat.lastMessage.sentAt;
  const sentToday = isToday(sentAt.toDate());

  const isoDate = sentAt.toDate().toISOString();
  const dt = DateTime.fromISO(isoDate);

  const timeOnly = dt.toLocaleString(DateTime.TIME_SIMPLE);
  const dateOnly = dt.toLocaleString(DateTime.DATE_MED);

  return (
    <Link
      href={`/chats/${smallBigString(user.uid, partner.id)}?partnerId=${
        partner.id
      }`}
    >
      <div className="flex p-4 px-8 gap-4 items-center border-b border-gray-300 cursor-pointer  w-full">
        {/* Pic and Name */}
        <div className="flex flex-col gap-2 items-center min-w-[200px]">
          <Avatar
            size={"lg"}
            src={partner.profilePictureUrl ? partner.profilePictureUrl : ""}
            alt={"Author"}
            name={partner.fullName}
            css={{
              border: "2px solid white",
            }}
          />
          <div className="font-bold text-lg">{partner.fullName}</div>
        </div>
        <div className="flex-1 h-full flex justify-between">
          {/* Last Message */}
          <div className="font-light">
            {lastMessage.length > 50
              ? `${lastMessage.substring(0, 50)}...`
              : lastMessage}
          </div>
          {/* Date and Read Sig */}
          <div className="flex gap-6 items-center">
            <div>{sentToday ? timeOnly : dateOnly}</div>
            {!readChat && (
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
