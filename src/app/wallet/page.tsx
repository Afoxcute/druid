"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import LoadingScreen from "~/app/wallet/_components/loading-screen";

export default function WalletLogin() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // User is authenticated, redirect to their wallet
      router.push(`/wallet/${user.id}`);
    } else if (!isLoading && !user) {
      // User is not authenticated, redirect to signin
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);

  // Show loading screen while checking authentication
  return <LoadingScreen />;
}
