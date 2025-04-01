"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "~/contexts/LanguageContext";
import { currencies, formatCurrency } from "~/lib/currencies";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Send, Edit2 } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { toast } from "react-hot-toast";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { parsePhoneNumber, formatPhoneNumber } from "~/lib/utils";

interface SendPreviewProps {
  params: {
    address: string;
  };
}

export default function SendPreview({ params }: SendPreviewProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [transferData, setTransferData] = useState<{
    amount: number;
    recipientName: string;
    country: string;
    phoneNumber: string;
    currency: string;
  } | null>(null);
  const { clickFeedback } = useHapticFeedback();

  useEffect(() => {
    const data = sessionStorage.getItem("transferData");
    if (data) {
      setTransferData(JSON.parse(data));
    } else {
      router.push(`/dashboard/${params.address}/send`);
    }
  }, [router, params.address]);

  const handleSend = async () => {
    setLoading(true);
    setError("");

    try {
      clickFeedback("medium");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
      clickFeedback("success");
      toast.success("Transfer successful!");
      
      // Wait for animation to complete
      setTimeout(() => {
        router.push(`/dashboard/${params.address}`);
      }, 2000);
    } catch (err) {
      setError(t("common.error.transferFailed"));
      clickFeedback("error");
      toast.error("Failed to send money. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    clickFeedback("soft");
    router.back();
  };

  const handleEdit = () => {
    router.push(`/dashboard/${params.address}/send`);
    clickFeedback("soft");
  };

  const handleSave = () => {
    router.push(`/dashboard/${params.address}/send`);
    clickFeedback("soft");
  };

  if (!transferData) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-light-blue p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">{t("send.transferSuccess")}</h2>
            <p className="text-gray-600 mb-6">
              {formatCurrency(transferData.amount, transferData.currency)} {t("send.transferredTo")} {transferData.recipientName}
            </p>
            <Button
              onClick={() => router.push(`/dashboard/${params.address}`)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t("common.continue")}
            </Button>
          </CardContent>
        </Card>
      </div>
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
          <h1 className="text-xl font-semibold ml-4">{t("send.confirmTransfer")}</h1>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("common.amount")}</span>
                <span className="font-semibold">
                  {formatCurrency(transferData.amount, transferData.currency)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("send.recipientName")}</span>
                <span className="font-semibold">{transferData.recipientName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("common.country")}</span>
                <span className="font-semibold">{transferData.country}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("common.phoneNumber")}</span>
                <span className="font-semibold">{transferData.phoneNumber}</span>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSend}
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
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