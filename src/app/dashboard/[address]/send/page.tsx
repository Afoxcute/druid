"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useAuth } from "~/providers/auth-provider";
import { shortStellarAddress } from "~/lib/utils";
import SendPreview from "./preview";
import LoadingScreen from "~/app/wallet/_components/loading-screen";

export default function SendPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Get user's wallet address from localStorage
        const userData = localStorage.getItem("auth_user");
        if (userData) {
          const user = JSON.parse(userData);
          if (user.walletAddress) {
            // Check if we're coming from dashboard with pinVerified
            const pinVerified = searchParams.get("pinVerified") === "true";
            if (pinVerified) {
              // If pinVerified is true, we can skip verification
              router.push(`/dashboard/${user.walletAddress}/send?pinVerified=true`);
            } else {
              // If not verified, redirect to PIN verification
              router.push("/auth/pin?redirectTo=/dashboard/send");
            }
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
  }, [user, isLoading, router, searchParams]);

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000;
  };

  const isValidRecipient = () => {
    // This is a simple check; in a real app, you'd validate the address format
    return recipient.length >= 10;
  };

  const handleBack = () => {
    clickFeedback();
    router.back();
  };

  const handleContinue = () => {
    clickFeedback();
    if (isValidAmount() && isValidRecipient()) {
      setShowPreview(true);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const handlePreviewSuccess = () => {
    // After successfully sending money, navigate back to dashboard
    router.push("/dashboard");
  };

  if (showPreview) {
    return (
      <SendPreview
        amount={parseFloat(amount)}
        recipient={recipient}
        recipientName={recipientName || "Recipient"}
        onBack={closePreview}
        onSuccess={handlePreviewSuccess}
      />
    );
  }

  // Show loading while checking auth and redirecting
  return <LoadingScreen />;
} 