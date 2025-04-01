"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { QrCode, Copy, Share2, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

export default function ReceiveTransfers() {
  const { address } = useParams();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const paymentLink = `${window.location.origin}/payment/${address}?amount=${amount}&message=${encodeURIComponent(message)}`;

  const handleShare = () => {
    clickFeedback();
    if (navigator.share) {
      navigator.share({
        title: "Druid Payment Link",
        text: `Send me money on Druid: ${paymentLink}`,
        url: paymentLink,
      });
    } else {
      navigator.clipboard.writeText(paymentLink);
    }
  };

  const handleCopy = () => {
    clickFeedback();
    navigator.clipboard.writeText(paymentLink);
  };

  const handleCreateQR = () => {
    clickFeedback();
    setShowQR(true);
  };

  const handleClosePreview = () => {
    clickFeedback();
    setShowQR(false);
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
              Generating your payment link...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 sm:p-6">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Receive Money</h1>

        <Card className="w-full">
          <CardHeader className="space-y-4">
            <CardTitle className="text-xl font-semibold">Create Payment Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">Amount (Optional)</Label>
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
                <Label htmlFor="message" className="text-base">Message (Optional)</Label>
                <Input
                  id="message"
                  placeholder="Add a message for the sender"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleCreateQR}
                className="h-12 w-full text-lg"
              >
                <QrCode className="mr-2 h-5 w-5" />
                Show QR Code
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                className="h-12 w-full text-lg"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share Link
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="h-12 w-full text-lg"
              >
                <Copy className="mr-2 h-5 w-5" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-4">
                <CardTitle className="text-xl font-semibold">Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="rounded-lg bg-white p-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}`}
                      alt="Payment QR Code"
                      className="h-48 w-48"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleClosePreview}
                  variant="outline"
                  className="h-12 w-full text-lg"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
