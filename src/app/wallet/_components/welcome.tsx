"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Check, UserPlus } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useAuth } from "~/providers/auth-provider";

interface WelcomeProps {
  isNewUser?: boolean;
  onCreateWallet?: () => void;
  onConnectWallet?: () => void;
}

export default function Welcome({
  isNewUser = true,
  onCreateWallet,
  onConnectWallet,
}: WelcomeProps) {
  const [hasCreatedWallet, setHasCreatedWallet] = useState(false);
  const { clickFeedback } = useHapticFeedback();
  const { user } = useAuth();

  const handleCreateWallet = () => {
    clickFeedback();
    setHasCreatedWallet(true);
    
    setTimeout(() => {
      if (onCreateWallet) onCreateWallet();
    }, 2000);
  };

  const handleConnectWallet = () => {
    clickFeedback();
    if (onConnectWallet) onConnectWallet();
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        {isNewUser ? "Welcome to Druid!" : "Connect Your Wallet"}
      </h1>
      <p className="mb-8 text-muted-foreground text-lg">
        {isNewUser
          ? "Let's set up your digital wallet to send and receive payments securely."
          : "Connect to your existing Druid wallet."}
      </p>

      {hasCreatedWallet ? (
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">Creating your wallet...</p>
        </div>
      ) : (
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            {isNewUser
              ? "Create a digital wallet to store and transfer money securely."
              : "Connect to access your funds and transaction history."}
          </p>
        </div>
      )}

      {isNewUser ? (
        <Button
          onClick={handleCreateWallet}
          className="mb-4 w-full h-12 text-lg"
          disabled={hasCreatedWallet}
        >
          {hasCreatedWallet ? "Creating Wallet..." : "Create Wallet"}
        </Button>
      ) : (
        <Button onClick={handleConnectWallet} className="mb-4 w-full h-12 text-lg">
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
