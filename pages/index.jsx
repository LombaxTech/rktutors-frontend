import useCustomAuth from "../customHooks/useCustomAuth";
import { useRouter } from "next/router";

import LandingPage from "../LandingPage";

import TutorHome from "../components/Tutor/TutorHome";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useCustomAuth();

  // Landing page
  if (!loading && !user) return <LandingPage />;

  // default app
  if (!loading && user) {
    if (user.type === "student") {
      return <div>studnet</div>;
    }

    if (user.type === "tutor") {
      return <TutorHome />;
    }
  }
}
