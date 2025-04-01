"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, ChevronRight, Send } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useAuth } from "~/providers/auth-provider";
import { shortStellarAddress, parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";
import SendPreview from "./preview";

export default function SendMoney() {
  const { user } = useAuth();
  const router = useRouter();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  
  useEffect(() => {
    // Check if user has a wallet address
    const userData = localStorage.getItem("auth_user");
    if (!userData) {
      router.push("/dashboard");
      return;
    }

    const user = JSON.parse(userData);
    if (!user.walletAddress) {
      router.push("/dashboard");
      return;
    }

    // Set PIN verification to true since we're already authenticated
    setIsPinVerified(true);
  }, [router]);

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000;
  };

  const isValidRecipient = () => {
    // This is a simple check; in a real app, you'd validate the address format
    return recipient.length >= 10;
  };

  const handleBack = () => {
    clickFeedback("soft");
    if (showPreview) {
      setShowPreview(false);
    } else {
      router.back();
    }
  };

  const handleContinue = () => {
    clickFeedback("medium");

    // Validate inputs
    if (!amount || !recipient || !recipientName || !country || !phoneNumber) {
      setError("Please fill in all fields");
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    // Validate phone number
    const parsedNumber = parsePhoneNumber(phoneNumber);
    if (!parsedNumber) {
      setError("Please enter a valid phone number");
      return;
    }

    setError(null);
    setShowPreview(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    setError(null);
  };

  const handlePreviewSuccess = () => {
    // After successfully sending money, navigate back to dashboard
    router.push("/dashboard");
  };

  if (!isPinVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <SendPreview
        amount={parseFloat(amount)}
        recipient={recipient}
        recipientName={recipientName || "Recipient"}
        onBack={handleBack}
        onSuccess={handlePreviewSuccess}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-light-blue p-4">
      <Card className="w-full max-w-md animate-slide-in">
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-blue-600">
              Send Money
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient's name"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient's address"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="h-12 text-base"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
          >
            <Send className="mr-2 h-5 w-5" />
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 