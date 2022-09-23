import { Spinner } from "@chakra-ui/react";

export default function LoadingPage({ message }) {
  return (
    <div className="h-screen flex gap-4 justify-center items-center bg-gray-200">
      <span className="text-2xl font-bold">{message}</span>
      <Spinner size={"xl"} />
    </div>
  );
}
