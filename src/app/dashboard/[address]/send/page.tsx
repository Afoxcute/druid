"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "~/contexts/LanguageContext";
import { currencies, formatCurrency } from "~/lib/currencies";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import SendPreview from "./preview";
import { parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";

interface SendPageProps {
  params: {
    address: string;
  };
}

export default function SendPage({ params }: SendPageProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { clickFeedback } = useHapticFeedback();
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const handleBack = () => {
    clickFeedback("soft");
    router.back();
  };

  const handleContinue = () => {
    setError("");
    
    if (!amount || !recipientName || !country || !phoneNumber) {
      setError(t("common.error.requiredFields"));
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(t("common.error.invalidAmount"));
      return;
    }

    // Store the data in session storage for the preview page
    sessionStorage.setItem(
      "transferData",
      JSON.stringify({
        amount: numAmount,
        recipientName,
        country,
        phoneNumber,
        currency: selectedCurrency,
      })
    );

    router.push(`/dashboard/${params.address}/send/preview`);
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
    <div className="min-h-screen bg-gradient-light-blue p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-4">{t("send.title")}</h1>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.amount")}
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t("send.enterAmount")}
                    className="flex-1"
                  />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(currencies).map(([code, currency]) => (
                      <option key={code} value={code}>
                        {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("send.recipientName")}
                </label>
                <Input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder={t("send.enterRecipientName")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.country")}
                </label>
                <Input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder={t("send.enterCountry")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.phoneNumber")}
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t("send.enterPhoneNumber")}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleContinue}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("common.continue")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 