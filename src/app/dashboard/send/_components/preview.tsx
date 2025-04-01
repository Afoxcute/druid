"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useAuth } from "~/providers/auth-provider";
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
  const { user } = useAuth();
  const { clickFeedback } = useHapticFeedback();
  const [isSending, setIsSending] = useState(false);

  const handleBack = () => {
    clickFeedback();
    onBack();
  };

  const handleSend = async () => {
    clickFeedback();
    setIsSending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // In a real app, this would be an actual API call to send the money
      console.log("Sending money:", {
        from: user?.passkeyCAddress,
        to: recipient,
        amount,
      });

      onSuccess();
    } catch (error) {
      console.error("Failed to send money:", error);
      // In a real app, show error toast
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Review Transaction</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user?.name || "Your wallet"}</p>
                  <p className="text-xs text-gray-500">
                    {shortStellarAddress(user?.passkeyCAddress || "")}
                  </p>
                </div>
                <p className="font-bold">$1,234.56</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">To</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{recipientName}</p>
                  <p className="text-xs text-gray-500">
                    {shortStellarAddress(recipient)}
                  </p>
                </div>
                <p className="font-bold">-${amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Network Fee</p>
                <p className="text-sm">$0.00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button
          className="w-full"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Send Money
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 