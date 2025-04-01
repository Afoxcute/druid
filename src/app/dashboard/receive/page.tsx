"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useHapticFeedback } from "~/providers/haptic-feedback-provider";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useAuth } from "~/providers/auth-provider";

export default function ReceivePage() {
  const router = useRouter();
  const { clickFeedback } = useHapticFeedback();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const walletAddress = user?.id?.toString() || "wallet_address_here";

  const handleCopy = async () => {
    clickFeedback("medium");
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-md space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            clickFeedback();
            router.back();
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Receive Money</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Wallet Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <p className="font-mono text-sm break-all">{walletAddress}</p>
          </div>

          <Button
            className="w-full"
            onClick={handleCopy}
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Address
              </>
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Share this address with others to receive money. Make sure to verify the address before sharing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 