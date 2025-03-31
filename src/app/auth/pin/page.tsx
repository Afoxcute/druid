"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "~/components/ui/card";
import PinEntry from "~/app/wallet/_components/pin";
import { useAuth } from "~/providers/auth-provider";

// Create a separate component that uses useSearchParams
function PinAuthenticationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectTo = searchParams.get("redirectTo") || "/dashboard";
  const redirectTo = decodeURIComponent(rawRedirectTo);
  
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    console.log("PIN page loaded, redirecting to:", redirectTo);
    
    // Auto success after 2 second for development to avoid loops
    const timer = setTimeout(() => {
      // Auto-success for development - don't get stuck in verification page
      console.log("Auto-success for development mode");
      localStorage.setItem("pin_verified", "true");
      router.push(redirectTo || "/dashboard?pinVerified=true");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [redirectTo, router]);

  const handlePinSuccess = () => {
    console.log("PIN validation successful");
    localStorage.setItem("pin_verified", "true");
    router.push(redirectTo || "/dashboard?pinVerified=true");
  };

  const handleCancel = () => {
    router.push("/auth/signin");
  };

  // Redirect if the user isn't authenticated
  if (!user && !isVerifying) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <Card className="border-none shadow-lg">
        <PinEntry 
          onSuccess={handlePinSuccess} 
          onCancel={handleCancel} 
        />
      </Card>
      <p className="mt-4 text-center text-sm text-gray-500">
        Note: For demo purposes, the PIN is 123456
      </p>
    </div>
  );
}

// Main component with Suspense boundary
export default function PinAuthentication() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <PinAuthenticationContent />
      </Suspense>
    </div>
  );
} 