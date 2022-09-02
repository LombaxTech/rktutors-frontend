import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { useRouter } from "next/router";

export default function useRedirectAuth() {
  const router = useRouter();

  const { user, userLoading } = useContext(AuthContext);

  useEffect(() => {
    async function init() {
      if (!userLoading && !user) {
        router.push("/login");
      }
    }

    init();
  }, [userLoading, user]);
}
