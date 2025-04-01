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
        // Get user's wallet address from localStorage
        const userData = localStorage.getItem("auth_user");
        if (userData) {
          const user = JSON.parse(userData);
          if (user.walletAddress) {
            // Redirect to the user's send page
            router.push(`/dashboard/${user.walletAddress}/send`);
          } else {
            // User has no wallet address, redirect to dashboard
            router.push("/dashboard");
          }
        } else {
          // No user data found, redirect to dashboard
          router.push("/dashboard");
        }
      } else {
        // User not authenticated, redirect to sign in
        router.push("/auth/signin");
      }
    }
  }, [user, isLoading, router]);
  
  // Show loading while checking auth and redirecting
  return <LoadingScreen />;
} 