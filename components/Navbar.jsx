import useCustomAuth from "../customHooks/useCustomAuth";

import { signOut, getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase/firebaseClient";

const auth = getAuth(firebaseApp);

export default function Navbar() {
  const { user, loading } = useCustomAuth();

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-24 w-full bg-red-500 flex justify-between">
      <div>nav</div>
      {user && (
        <button className="btn btn-secondary" onClick={signout}>
          logout
        </button>
      )}
    </div>
  );
}
