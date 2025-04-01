"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Send, Edit2, ShieldCheck } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { toast } from "react-hot-toast";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";
import { api } from "~/trpc/react";

interface SendPreviewProps {
  amount: number;
  recipientName: string;
  country: string;
  phoneNumber: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  onBack: () => void;
  onSuccess: () => void;
  onEdit: () => void;
}

export default function SendPreview({
  amount,
  recipientName,
  country,
  phoneNumber,
  currency,
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
  
  // OTP verification states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // TRPC mutations for OTP
  const sendOtpMutation = api.post.otp.useMutation({
    onSuccess: (data) => {
      setOtpSent(true);
      
      // In development, the server returns the actual OTP for easier testing
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev && typeof data === 'string' && data.length === 6) {
        // Auto-fill the OTP in development mode for easier testing
        console.log('DEV MODE: Auto-filling OTP:', data);
        setOtpCode(data);
      }
      
      toast.success("Verification code sent to your phone");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(`Failed to send verification code: ${error.message}`);
    }
  });
  
  const verifyOtpMutation = api.post.verifyOtp.useMutation({
    onSuccess: () => {
      toast.success("Phone verified successfully");
      processPayment();
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(`Verification failed: ${error.message}`);
    }
  });

  const handleInitiateVerification = async () => {
    try {
      clickFeedback("medium");
      setIsLoading(true);
      
      // Send OTP to the user's phone
      await sendOtpMutation.mutateAsync({ phone: phoneNumber });
      
      // Show the OTP verification form
      setShowOtpVerification(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to initiate verification. Please try again.");
    }
  };
  
  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      await sendOtpMutation.mutateAsync({ phone: phoneNumber });
      toast.success("New verification code sent");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsResendingOtp(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }
    
    setIsLoading(true);
    clickFeedback("medium");
    
    try {
      await verifyOtpMutation.mutateAsync({ 
        phone: phoneNumber,
        otp: otpCode 
      });
    } catch (error) {
      // Error is handled in the mutation callbacks
      setIsLoading(false);
    }
  };

  const processPayment = async () => {
    try {
      // Simulate API call for payment processing
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

  const handleSend = async () => {
    clickFeedback("medium");
    
    // Start the verification process first
    await handleInitiateVerification();
  };

  const handleBack = () => {
    if (showOtpVerification) {
      setShowOtpVerification(false);
      return;
    }
    
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
              Your payment of {currency.symbol}{amount.toFixed(2)} {currency.code} has been sent to {recipientName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{currency.symbol}{amount.toFixed(2)} {currency.code}</span>
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
  
  if (showOtpVerification) {
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
                Verify Phone
              </CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              We've sent a verification code to {phoneNumber}. Please enter it below to confirm your transfer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center items-center mb-6">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otpCode" className="text-sm text-gray-600">
                  Verification Code
                </Label>
                <Input
                  id="otpCode"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="h-12 text-center text-lg tracking-widest"
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={handleResendOtp}
                  disabled={isResendingOtp}
                  className="text-blue-600"
                >
                  {isResendingOtp ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={isLoading || otpCode.length < 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Send"
              )}
            </Button>
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
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">{currency.symbol}{amount.toFixed(2)} {currency.code}</span>
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