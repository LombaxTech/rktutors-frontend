import { useState, useEffect, createContext } from "react";

import { db } from "../firebase/firebaseClient";
import { onSnapshot, query, where, collection } from "firebase/firestore";

import useCustomAuth from "../customHooks/useCustomAuth";

export const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
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
    <ChatsContext.Provider value={{ chats }}>{children}</ChatsContext.Provider>
  );
};
