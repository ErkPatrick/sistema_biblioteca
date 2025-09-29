import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
