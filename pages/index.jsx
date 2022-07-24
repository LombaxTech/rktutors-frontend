import useCustomAuth from "../customHooks/useCustomAuth";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useCustomAuth();

  // Landing page
  if (!user)
    return (
      <div>
        <div>should be a landing page here</div>
        <button class="btn btn-primary" onClick={() => router.push("/login")}>
          Go to login
        </button>
        <div className="h-screen bg-red-400">hello</div>
        <div className="h-screen bg-purple-400">hello</div>
      </div>
    );

  // default app
  if (user)
    return (
      <div className="flex-1 bg-orange-300">
        <div className="h-screen bg-blue-200">hello</div>
        <div className="h-screen bg-green-200">hello</div>
        <button class="btn btn-primary" onClick={() => router.push("/login")}>
          Go to login
        </button>
      </div>
    );
}
