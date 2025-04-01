"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ArrowLeft, CheckCircle2, Edit2 } from "lucide-react";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { toast } from "sonner";

interface SendPreviewProps {
  amount: number;
  recipientName: string;
  country: string;
  phoneNumber: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  onBack: () => void;
  onSuccess: () => void;
  onEdit: () => void;
}

export default function SendPreview({
  amount,
  recipientName,
  country,
  phoneNumber,
  currency,
  onBack,
  onSuccess,
  onEdit,
}: SendPreviewProps) {
  const t = useTranslations();
  const { clickFeedback } = useHapticFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCountry, setEditedCountry] = useState(country);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(phoneNumber);

  const handleSend = async () => {
    setIsLoading(true);
    clickFeedback("soft");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      clickFeedback("success");
      toast.success(t("send.preview.success.title"));
      
      // Navigate to success page after a delay
      setTimeout(onSuccess, 2000);
    } catch (error) {
      clickFeedback("error");
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    clickFeedback("soft");
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-light-blue p-4">
        <Card className="w-full max-w-md animate-slide-in">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-2xl font-bold text-blue-600">
                {t("send.preview.success.title")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("send.preview.success.message", {
                    amount: `${currency.symbol}${amount.toFixed(2)} ${currency.code}`,
                  })}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t("send.preview.success.description")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-light-blue p-4">
      <Card className="w-full max-w-md animate-slide-in">
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-blue-600">
              {t("send.preview.title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm text-gray-500">{t("send.preview.amount")}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {currency.symbol}
                  {amount.toFixed(2)} {currency.code}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm text-gray-500">{t("send.preview.recipient")}</p>
                <p className="text-lg font-semibold text-gray-900">{recipientName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm text-gray-500">{t("send.preview.country")}</p>
                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <Input
                      value={editedCountry}
                      onChange={(e) => setEditedCountry(e.target.value)}
                      className="h-8"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        className="h-8 bg-blue-600 hover:bg-blue-700"
                      >
                        {t("common.save")}
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="h-8"
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {editedCountry}
                    </p>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm text-gray-500">{t("send.preview.phone")}</p>
                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <Input
                      value={editedPhoneNumber}
                      onChange={(e) => setEditedPhoneNumber(e.target.value)}
                      className="h-8"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        className="h-8 bg-blue-600 hover:bg-blue-700"
                      >
                        {t("common.save")}
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="h-8"
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {editedPhoneNumber}
                    </p>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? t("common.loading") : t("common.continue")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 