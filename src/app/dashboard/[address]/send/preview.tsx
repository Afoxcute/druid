"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "~/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

interface SendPreviewProps {
  amount: number;
  recipientName: string;
  country: string;
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
  onEdit: () => void;
}

export default function SendPreview({
  amount,
  recipientName,
  country,
  phoneNumber,
  onBack,
  onSuccess,
  onEdit,
}: SendPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleSend = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      toast.success(t("send.transferSuccess"));

      // Navigate to success page after a delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(t("common.error"));
      toast.error(t("common.errorDescription"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
          <h1 className="text-2xl font-bold text-gray-900">{t("send.transferSuccess")}</h1>
          <p className="text-gray-600">{t("send.transferDetails")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-md mx-auto p-4">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">{t("send.confirmTransfer")}</h1>
        </div>

        <Card className="bg-white">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("common.amount")}</span>
                <span className="font-semibold">${amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("send.recipientName")}</span>
                <span className="font-semibold">{recipientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("common.country")}</span>
                <span className="font-semibold">{country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("common.phoneNumber")}</span>
                <span className="font-semibold">{phoneNumber}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={onEdit}
                variant="outline"
                className="flex-1"
              >
                {t("common.edit")}
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("common.confirm")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 