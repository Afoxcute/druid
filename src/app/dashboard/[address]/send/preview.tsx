"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Send, Edit2 } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { toast } from "react-hot-toast";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";

interface SendPreviewProps {
  amount: number;
  recipientName: string;
  country: string;
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
  onEdit: () => void;
}

export default function SendPreview({
  amount,
  recipientName,
  country,
  phoneNumber,
  onBack,
  onSuccess,
  onEdit,
}: SendPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCountry, setEditedCountry] = useState(country);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(phoneNumber);
  const { clickFeedback } = useHapticFeedback();

  const handleSend = async () => {
    try {
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

  const handleEdit = () => {
    setIsEditing(true);
    clickFeedback("soft");
    onEdit();
  };

  const handleSave = () => {
    setIsEditing(false);
    clickFeedback("soft");
    onEdit();
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-light-blue p-4">
        <Card className="w-full max-w-md animate-slide-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Transfer Successful!
            </CardTitle>
            <CardDescription className="mt-2">
              Your payment of ${amount.toFixed(2)} USD has been sent to {recipientName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-semibold">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">{country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold">{phoneNumber}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={onSuccess}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
            >
              Done
            </Button>
          </CardFooter>
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
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-semibold">{recipientName}</span>
                </div>
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="editCountry" className="text-sm text-gray-600">
                        Country
                      </Label>
                      <Input
                        id="editCountry"
                        value={editedCountry}
                        onChange={(e) => setEditedCountry(e.target.value)}
                        placeholder="Enter recipient's country"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editPhone" className="text-sm text-gray-600">
                        Phone Number
                      </Label>
                      <Input
                        id="editPhone"
                        value={editedPhoneNumber}
                        onChange={(e) => setEditedPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="h-12"
                      />
                    </div>
                    <Button
                      onClick={handleSave}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-semibold">{country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold">{phoneNumber}</span>
                    </div>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="w-full h-12 text-base"
                    >
                      Edit Details
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={isLoading}
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