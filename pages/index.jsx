import useCustomAuth from "../customHooks/useCustomAuth";
import { useRouter } from "next/router";

import LandingPage from "../LandingPage";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useCustomAuth();

  // Landing page
  if (!user) return <LandingPage />;

  // default app
  if (user)
    return (
      <div className="flex-1 bg-orange-300">
        <div className="h-screen bg-blue-200">hello</div>
        <div className="h-screen bg-green-200">hello</div>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/login")}
        >
          Go to login
        </button>
      </div>
    );
}
