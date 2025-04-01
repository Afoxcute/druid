"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useQRScanner } from "~/hooks/useQRScanner";
import { QrCode, Share2, Copy, X } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function ReceiveTransfers() {
  const { address } = useParams();
  const { clickFeedback } = useHapticFeedback();
  const { scan } = useQRScanner();
  const [showQR, setShowQR] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: user } = api.users.getUser.useQuery({
    address: String(address),
  });

  const handleShare = () => {
    clickFeedback();
    if (navigator.share) {
      navigator.share({
        title: "Druid Payment Link",
        text: `Send me money on Druid!`,
        url: window.location.href,
      });
    }
  };

  const handleCopy = () => {
    clickFeedback();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateQR = () => {
    clickFeedback();
    setShowQR(true);
  };

  const handleClosePreview = () => {
    clickFeedback();
    setShowQR(false);
  };

  const paymentLink = `${window.location.origin}/payment/${address}?amount=${amount}&message=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-md">
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Receive Money
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
                <Label htmlFor="message" className="text-base">
                  Message (Optional)
                </Label>
                <Input
                  id="message"
                  type="text"
                  placeholder="Add a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Your Address</Label>
                <div className="flex items-center space-x-2 rounded-md border border-primary/20 bg-primary/5 p-3">
                  <code className="flex-1 text-sm font-mono">{address}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleCreateQR}
                className="h-12"
              >
                <QrCode className="mr-2 h-5 w-5" />
                QR Code
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="h-12"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share Link
              </Button>
            </div>

            {showQR && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <Card className="w-full max-w-sm border-primary/20 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold">Scan QR Code</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClosePreview}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="flex h-64 w-64 items-center justify-center rounded-lg border border-primary/20 bg-white p-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}`}
                        alt="Payment QR Code"
                        className="h-full w-full"
                      />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Scan this QR code to send money
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
