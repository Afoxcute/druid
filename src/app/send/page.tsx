"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import LoadingScreen from "~/app/wallet/_components/loading-screen";

export default function SendPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect to the user's send page
        router.push(`/wallet/${user.id}/send`);
      } else {
        // User not authenticated, redirect to sign in
        router.push("/auth/signin");
      }
    }
  }, [user, isLoading, router]);
  
  // Show loading while checking auth and redirecting
  return <LoadingScreen />;
} 