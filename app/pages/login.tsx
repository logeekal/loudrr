import { Spinner } from "@chakra-ui/spinner";
import { auth } from "neo4j-driver";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login() {
  const {
    query: { result },
  } = useRouter();
  const [authState, setAuthState] = useState<"pending" | "success" | "faliure">(
    "pending"
  );

  useEffect(() => {
    console.log(result);
    if (result === "success") {
      setAuthState("success");
    } else if (result === "faliure") {
      setAuthState("faliure");
    }
  }, [result]);

  if (authState === "pending") {
    return <Spinner size="3xl" />;
  }

  if (authState == "success") {
    return "Authenticated";
  }

  if (authState === "faliure") {
    return "Some Error";
  }
}
