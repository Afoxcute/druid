"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import SendPreview from "./preview";
import { parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";
import { useLanguage } from "~/contexts/LanguageContext";

interface SendPageProps {
  params: {
    address: string;
  };
}

export default function SendPage({ params }: SendPageProps) {
  const router = useRouter();
  const { clickFeedback } = useHapticFeedback();
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    clickFeedback("soft");
    router.back();
  };

  const handleContinue = () => {
    setError("");

    // Validate all fields
    if (!amount || !recipientName || !country || !phoneNumber) {
      setError(t("common.allFieldsRequired"));
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError(t("common.invalidAmount"));
      return;
    }

    // Validate phone number
    try {
      const phone = parsePhoneNumber(phoneNumber);
      if (!phone) {
        setError(t("common.invalidPhoneNumber"));
        return;
      }
    } catch (e) {
      setError(t("common.invalidPhoneNumber"));
      return;
    }

    // Navigate to preview page
    router.push(`/dashboard/${params.address}/send/preview?amount=${amount}&recipientName=${recipientName}&country=${country}&phoneNumber=${phoneNumber}`);
  };

  const handleEdit = () => {
    setShowPreview(false);
    clickFeedback("soft");
  };

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  if (showPreview) {
    return (
      <SendPreview
        amount={parseFloat(amount)}
        recipientName={recipientName}
        country={country}
        phoneNumber={phoneNumber}
        onBack={() => setShowPreview(false)}
        onSuccess={handleSuccess}
        onEdit={handleEdit}
      />
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
              {t("send.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm text-gray-600">
                {t("common.amount")}
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("send.enterAmount")}
                className="h-12 text-lg"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName" className="text-sm text-gray-600">
                {t("send.recipientName")}
              </Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t("send.recipientName")}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm text-gray-600">
                {t("common.country")}
              </Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t("common.country")}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm text-gray-600">
                {t("common.phoneNumber")}
              </Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t("common.phoneNumber")}
                className="h-12"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
          >
            {t("common.continue")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 