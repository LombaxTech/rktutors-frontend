import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoadingPage from "./LoadingPage";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const { user, userLoading } = useContext(AuthContext);

  return (
    <>
      {/* Loading */}
      {userLoading && <LoadingPage />}

      {/* No user */}
      {!userLoading && !user && <>{children}</>}

      {/* User */}
      {!userLoading && user && (
        <div className="max-h-screen min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
        </div>
      )}
    </>
  );
}
