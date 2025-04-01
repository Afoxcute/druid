"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { toast } from "react-hot-toast";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { clickFeedback } = useHapticFeedback();

  const handleSend = async () => {
    try {
      // Validate phone number
      const parsedNumber = parsePhoneNumber(phoneNumber);
      if (!parsedNumber) {
        setError("Please enter a valid phone number");
        return;
      }

      setIsLoading(true);
      clickFeedback("medium");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      clickFeedback("success");
      toast.success("Transfer successful!");
      
      // Wait for animation to complete
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      clickFeedback("error");
      toast.error("Failed to send money. Please try again.");
    }
  };

  const handleBack = () => {
    clickFeedback("soft");
    onBack();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
    setError(null);
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-light-blue p-4">
        <Card className="w-full max-w-md animate-slide-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Transfer Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold text-green-600">
                    ${amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recipient:</span>
                  <span className="font-semibold text-green-600">
                    {recipientName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="font-semibold text-green-600">
                    {phoneNumber}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
              Confirm Transfer
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-lg font-semibold text-blue-600">
                  ${amount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recipient:</span>
                <span className="font-semibold text-blue-600">
                  {recipientName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Address:</span>
                <span className="font-mono text-sm text-blue-600 break-all">
                  {recipient}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
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
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              This is a demo transaction. No actual funds will be transferred.
            </p>
          </div>

          <Button
            onClick={handleSend}
            disabled={isLoading || !phoneNumber || !country}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Confirm & Send
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 