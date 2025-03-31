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
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Log the current state for debugging
  useEffect(() => {
    console.log("PIN page loaded, user:", user ? "authenticated" : "not authenticated");
    console.log("Redirect destination:", redirectTo);
  }, [user, redirectTo]);

  const handlePinSuccess = () => {
    if (hasRedirected) return; // Prevent double redirects
    
    setHasRedirected(true);
    console.log("PIN verification successful, redirecting to:", redirectTo);
    
    // In a real app, we'd set a session token or something similar
    // For now, just redirect to the specified path
    setTimeout(() => {
      try {
        // If the redirectTo already has a query string, handle that correctly
        if (redirectTo.includes('?')) {
          // Already has query parameters
          if (redirectTo.includes('pinVerified=true')) {
            // Already has the pinVerified parameter
            router.push(redirectTo);
          } else {
            // Add the pinVerified parameter to existing query
            router.push(`${redirectTo}&pinVerified=true`);
          }
        } else {
          // No existing query parameters, add the pinVerified parameter
          router.push(`${redirectTo}?pinVerified=true`);
        }
      } catch (error) {
        console.error("Error during redirect:", error);
        // Fallback if there's an error with the redirect URL
        router.push("/dashboard?pinVerified=true");
      }
    }, 100);
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