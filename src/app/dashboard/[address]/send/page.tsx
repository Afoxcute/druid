"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";

export default function SendPage() {
  const router = useRouter();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("auth_user");
    if (!userData) {
      router.push("/auth/signin");
      return;
    }
  }, [router]);

  const handleContinue = () => {
    clickFeedback();
    if (!amount || !recipient) {
      setError("Please fill in all fields");
      return;
    }
    setIsPreview(true);
  };

  const handleBack = () => {
    clickFeedback();
    if (isPreview) {
      setIsPreview(false);
      setError("");
    } else {
      router.back();
    }
  };

  const handleSend = async () => {
    clickFeedback();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to send payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto max-w-md">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 h-10 w-10 rounded-full p-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-4">
              <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Confirm Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">${amount} USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-semibold">{recipientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-mono text-sm">{recipient}</span>
                </div>
              </div>

              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="h-12 w-full text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Confirm & Send"
                )}
              </Button>

              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 h-10 w-10 rounded-full p-0"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Send Money
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">
                  Amount (USD)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-base">
                  Recipient Name
                </Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter recipient's name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base">
                  Recipient Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter recipient's address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="h-12 text-lg font-mono"
                />
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="h-12 w-full text-lg"
            >
              Continue
            </Button>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 