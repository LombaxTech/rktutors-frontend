import { Spinner } from "@chakra-ui/react";

export default function LoadingPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      <Spinner size={"xl"} />
    </div>
  );
}
