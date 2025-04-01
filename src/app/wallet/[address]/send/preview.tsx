"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, Check, CircleAlert } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useParams } from "next/navigation";
import { shortStellarAddress } from "~/lib/utils";

interface SendPreviewProps {
  amount: number;
  recipient: string;
  recipientName: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function SendPreview({
  amount,
  recipient,
  recipientName,
  onBack,
  onSuccess,
}: SendPreviewProps) {
  const { address } = useParams();
  const { clickFeedback } = useHapticFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    clickFeedback("medium");
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll always succeed
      setIsSuccess(true);
      clickFeedback("success");
      
      // After 1.5 seconds, call onSuccess to navigate back
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError("Transaction failed. Please try again.");
      clickFeedback("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    clickFeedback();
    onBack();
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-6 p-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Success!</h1>
          <p className="mt-2 text-gray-500">
            Your transfer of ${amount.toFixed(2)} to {recipientName} was successful.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack} disabled={isLoading}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Confirm Transfer</h1>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b p-4">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
          </div>
          <div className="border-b p-4">
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium">My Wallet</p>
            <p className="text-xs text-gray-500">
              {shortStellarAddress(String(address))}
            </p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{recipientName}</p>
            <p className="text-xs text-gray-500">
              {shortStellarAddress(recipient)}
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center rounded-lg bg-red-50 p-3 text-red-800">
          <CircleAlert className="mr-2 h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-lg bg-amber-50 p-3 text-amber-800">
        <p className="text-sm">
          <strong>Note:</strong> This is a demo transaction. No actual funds will be transferred.
        </p>
      </div>

      <Button
        className="w-full"
        onClick={handleSend}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Confirm and Send"}
      </Button>
    </div>
  );
} 