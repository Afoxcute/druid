"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import LoadingScreen from "~/app/wallet/_components/loading-screen";

export default function SendPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  
  useEffect(() => {
    // Only process once to avoid any redirect loops
    if (!redirect) {
      setRedirect(true);
      
      if (!isLoading) {
        if (user?.id) {
          console.log("Redirecting to user wallet send page...");
          // Redirect to the user's send page
          router.replace(`/wallet/${user.id}/send`);
        } else {
          console.log("User not authenticated, redirecting to sign in...");
          // User not authenticated, redirect to sign in
          router.replace("/auth/signin");
        }
      }
    }
  }, [user, isLoading, router, redirect]);
  
  // Show loading while checking auth and redirecting
  return <LoadingScreen />;
} 