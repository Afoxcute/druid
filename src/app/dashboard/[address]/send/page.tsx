"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import SendPreview from "./preview";
import { parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";

export default function SendPage() {
  const router = useRouter();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    clickFeedback("soft");
    router.back();
  };

  const handleContinue = () => {
    clickFeedback("medium");
    
    // Validate inputs
    if (!amount || !recipient || !recipientName || !country || !phoneNumber) {
      setError("Please fill in all fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const parsedPhone = parsePhoneNumber(phoneNumber);
    if (!parsedPhone) {
      setError("Please enter a valid phone number");
      return;
    }

    setShowPreview(true);
  };

  const handleEdit = () => {
    setShowPreview(false);
    clickFeedback("soft");
  };

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  if (showPreview) {
    return (
      <SendPreview
        amount={parseFloat(amount)}
        recipient={recipient}
        recipientName={recipientName}
        country={country}
        phoneNumber={phoneNumber}
        onBack={() => setShowPreview(false)}
        onSuccess={handleSuccess}
        onEdit={handleEdit}
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
              <Label htmlFor="amount" className="text-sm text-gray-600">
                Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-12 text-lg"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm text-gray-600">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient's wallet address"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName" className="text-sm text-gray-600">
                Recipient Name
              </Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient's name"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm text-gray-600">
                Country
              </Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter recipient's country"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm text-gray-600">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-12"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 