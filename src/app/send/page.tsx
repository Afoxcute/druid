"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SendPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.walletAddress) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipientAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would implement the actual send logic
      // For now, we'll just simulate a successful send
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Money sent successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to send money. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Send Money</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="Enter recipient's wallet address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Money"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 