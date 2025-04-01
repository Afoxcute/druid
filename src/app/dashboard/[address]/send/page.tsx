"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useAuth } from "~/providers/auth-provider";
import { shortStellarAddress } from "~/lib/utils";
import SendPreview from "./preview";

export default function SendPage() {
  const { user } = useAuth();
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

  const handleBack = () => {
    clickFeedback();
    if (isPreview) {
      setIsPreview(false);
      setError("");
    } else {
      router.back();
    }
  };

  const handleContinue = () => {
    clickFeedback();
    if (!amount || !recipient) {
      setError("Please fill in all fields");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!recipient.match(/^[A-Z0-9]{56}$/)) {
      setError("Please enter a valid recipient address");
      return;
    }

    setIsPreview(true);
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <CardTitle className="flex items-center justify-center text-center text-3xl font-bold">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Druid
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground text-lg">
              Processing your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 sm:p-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {isPreview ? "Confirm Payment" : "Send Money"}
          </h1>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-4">
            <CardTitle className="text-xl font-semibold">
              {isPreview ? "Review Payment" : "Enter Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isPreview ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-base">
                      Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-12 pl-7 text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-base">
                      Recipient Address
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient's address"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-base">
                      Recipient Name (Optional)
                    </Label>
                    <Input
                      id="recipientName"
                      placeholder="Enter recipient's name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  onClick={handleContinue}
                  className="h-12 w-full text-lg"
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4 rounded-lg border bg-card/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">${amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-semibold">
                      {recipientName || recipient.slice(0, 8) + "..." + recipient.slice(-8)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                </div>

                <Button
                  onClick={handleSend}
                  className="h-12 w-full text-lg"
                >
                  Confirm & Send
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 