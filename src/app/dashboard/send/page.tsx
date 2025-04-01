"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useAuth } from "~/providers/auth-provider";
import { shortStellarAddress } from "~/lib/utils";
import SendPreview from "./preview";

export default function SendMoney() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) {
        return; // Wait for auth to load
      }

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      // Check if user has a wallet address
      const userData = localStorage.getItem("auth_user");
      if (userData) {
        const refreshedUser = JSON.parse(userData);
        if (!refreshedUser.walletAddress) {
          router.push("/dashboard");
          return;
        }
      }

      // Check if PIN is verified
      const pinVerified = localStorage.getItem("pin_verified");
      if (!pinVerified) {
        router.push("/auth/pin?redirectTo=/dashboard/send");
        return;
      }

      setIsPinVerified(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [user, isLoading, router]);

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

  // Show loading state while checking auth
  if (isLoading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isPinVerified) {
    return null; // Will redirect in useEffect
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Send Money</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="mb-2 text-sm text-gray-500">From</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.name || "Your wallet"}</p>
              <p className="text-xs text-gray-500">
                {user?.walletAddress ? shortStellarAddress(user.walletAddress) : ""}
              </p>
            </div>
            <p className="font-bold">$1,234.56</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className="pl-8"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {amount && !isValidAmount() && (
            <p className="text-sm text-red-500">
              Please enter a valid amount (up to $1,000)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="G..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          {recipient && !isValidRecipient() && (
            <p className="text-sm text-red-500">
              Please enter a valid Stellar address
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Recipient Name (Optional)</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleContinue}
        disabled={!isValidAmount() || !isValidRecipient()}
      >
        Continue
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
} 