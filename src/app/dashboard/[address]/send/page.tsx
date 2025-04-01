"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useAuth } from "~/providers/auth-provider";
import { shortStellarAddress, formatPhoneNumber, parsePhoneNumber } from "~/lib/utils";
import SendPreview from "./preview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Country data with phone codes
const countries = [
  { code: "US", name: "United States", phoneCode: "+1" },
  { code: "GB", name: "United Kingdom", phoneCode: "+44" },
  { code: "CA", name: "Canada", phoneCode: "+1" },
  { code: "AU", name: "Australia", phoneCode: "+61" },
  { code: "DE", name: "Germany", phoneCode: "+49" },
  { code: "FR", name: "France", phoneCode: "+33" },
  { code: "IT", name: "Italy", phoneCode: "+39" },
  { code: "ES", name: "Spain", phoneCode: "+34" },
  { code: "JP", name: "Japan", phoneCode: "+81" },
  { code: "CN", name: "China", phoneCode: "+86" },
  { code: "IN", name: "India", phoneCode: "+91" },
  { code: "BR", name: "Brazil", phoneCode: "+55" },
  { code: "MX", name: "Mexico", phoneCode: "+52" },
  { code: "SG", name: "Singapore", phoneCode: "+65" },
  { code: "AE", name: "United Arab Emirates", phoneCode: "+971" },
];

export default function SendMoney() {
  const { user } = useAuth();
  const router = useRouter();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [showPreview, setShowPreview] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  
  useEffect(() => {
    // Check if user has a wallet address
    const userData = localStorage.getItem("auth_user");
    if (!userData) {
      router.push("/dashboard");
      return;
    }

    const user = JSON.parse(userData);
    if (!user.walletAddress) {
      router.push("/dashboard");
      return;
    }

    // Set PIN verification to true since we're already authenticated
    setIsPinVerified(true);
  }, [router]);

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000;
  };

  const isValidRecipient = () => {
    // This is a simple check; in a real app, you'd validate the address format
    return recipient.length >= 10;
  };

  const isValidPhoneNumber = () => {
    const country = countries.find(c => c.code === selectedCountry);
    if (!country) return false;
    
    const fullNumber = `${country.phoneCode}${phoneNumber}`;
    return parsePhoneNumber(fullNumber) !== null;
  };

  const handleBack = () => {
    clickFeedback();
    router.back();
  };

  const handleContinue = () => {
    clickFeedback();
    if (isValidAmount() && isValidRecipient() && isValidPhoneNumber()) {
      setShowPreview(true);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const handlePreviewSuccess = () => {
    // After successfully sending money, navigate back to dashboard
    router.push("/dashboard");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const country = countries.find(c => c.code === selectedCountry);
    if (!country) return;
    
    const value = e.target.value.replace(/\D/g, '');
    const formatted = formatPhoneNumber(value, country.phoneCode);
    setPhoneNumber(formatted);
  };

  if (!isPinVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (showPreview) {
    const country = countries.find(c => c.code === selectedCountry);
    const fullPhoneNumber = country ? `${country.phoneCode}${phoneNumber}` : phoneNumber;
    
    return (
      <SendPreview
        amount={parseFloat(amount)}
        recipient={recipient}
        recipientName={recipientName || "Recipient"}
        phoneNumber={fullPhoneNumber}
        country={country?.name || "United States"}
        onBack={closePreview}
        onSuccess={handlePreviewSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
          <h1 className="text-xl font-semibold">Send Money</h1>
        </div>

        {/* From Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <p className="mb-2 text-sm text-gray-500">From</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <p className="font-medium">{user?.name || "Your wallet"}</p>
                <p className="text-xs text-gray-500 break-all">
                  {user?.walletAddress ? shortStellarAddress(user.walletAddress) : ""}
                </p>
              </div>
              <p className="font-bold text-lg sm:text-xl">$1,234.56</p>
            </div>
          </CardContent>
        </Card>

        {/* Send Form */}
        <div className="space-y-4 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-8 h-12 text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {amount && !isValidAmount() && (
              <p className="text-sm text-red-500">
                Please enter a valid amount (up to $1,000)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="G..."
              className="h-12"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            {recipient && !isValidRecipient() && (
              <p className="text-sm text-red-500">
                Please enter a valid Stellar address
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Recipient Name (Optional)</Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="h-12"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Recipient Phone Number</Label>
            <div className="flex gap-2">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[120px] h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.phoneCode} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                placeholder="Phone number"
                className="h-12 flex-1"
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
            </div>
            {phoneNumber && !isValidPhoneNumber() && (
              <p className="text-sm text-red-500">
                Please enter a valid phone number
              </p>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          className="w-full h-12 text-base font-medium"
          onClick={handleContinue}
          disabled={!isValidAmount() || !isValidRecipient() || !isValidPhoneNumber()}
        >
          Continue
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
} 