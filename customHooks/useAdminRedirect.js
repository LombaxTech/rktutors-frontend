import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { useRouter } from "next/router";

export default function useRedirectAuth() {
  const router = useRouter();

  const { user, userLoading } = useContext(AuthContext);

  const [redirectLoading, setRedirectLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setRedirectLoading(true);

      if (!userLoading && !user) {
        router.push("/login");
      }

      if (user.type !== "admin") {
        router.push("/");
      }

      if (user.type === "admin") {
        setRedirectLoading(false);
      }
    }

    init();
  }, [userLoading, user]);

  return { redirectLoading };
}
