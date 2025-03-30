"use client";

import { useAuth } from "~/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TelegramAuthProps {
  children: React.ReactNode;
}

export default function TelegramAuth({ children }: TelegramAuthProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
} 