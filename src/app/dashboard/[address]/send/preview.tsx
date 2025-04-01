"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useToast } from "~/components/ui/use-toast";

interface SendPreviewProps {
  amount: number;
  recipient: string;
  recipientName: string;
  phoneNumber: string;
  country: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function SendPreview({
  amount,
  recipient,
  recipientName,
  phoneNumber,
  country,
  onBack,
  onSuccess,
}: SendPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { clickFeedback } = useHapticFeedback();
  const { toast } = useToast();

  const handleSend = async () => {
    clickFeedback();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate success
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Money sent successfully",
        variant: "success",
      });
      
      // Navigate after success
      setTimeout(onSuccess, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send money. Please try again.",
        variant: "destructive",
      });
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
      <div className="min-h-screen bg-gradient-light-blue flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center animate-slide-in">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Money Sent!</h1>
          <p className="text-gray-600">
            Your transfer of ${amount.toFixed(2)} has been sent successfully.
          </p>
          <Card className="mt-6">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Recipient</span>
                <span className="font-semibold">{recipientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Country</span>
                <span className="font-semibold">{country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Phone</span>
                <span className="font-semibold">{phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Address</span>
                <span className="font-mono text-sm break-all">{recipient}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light-blue p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Confirm Transfer</h1>
        </div>

        {/* Transfer Details */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold text-lg">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Recipient</span>
              <span className="font-semibold">{recipientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Country</span>
              <span className="font-semibold">{country}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Phone</span>
              <span className="font-semibold">{phoneNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Address</span>
              <span className="font-mono text-sm break-all">{recipient}</span>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            Note: This is a demo transaction. No actual funds will be transferred.
          </p>
        </div>

        {/* Confirm Button */}
        <Button
          className="w-full h-12 text-base font-medium"
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm & Send
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 