"use client";
import { type FC, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import Disclaimer from "./disclaimer";
import { useHapticFeedback } from "~/hooks/useHapticFeedback";
import { useRouter } from "next/navigation";

interface Props {
  handleGoBack: () => void;
  amount: number | string;
  recipient: string;
}

const PreviewTransfer: FC<Props> = ({ handleGoBack, amount, recipient }) => {
  const { clickFeedback } = useHapticFeedback();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsProcessing(true);
    clickFeedback("medium");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsSuccess(true);
    clickFeedback("medium");
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-green-600">Transfer Successful!</h1>
        <p className="text-gray-600">
          You have sent ${Number(amount).toFixed(2)} to {recipient}
        </p>
        <Button
          className="mt-6 w-full bg-green-600 hover:bg-green-700"
          onClick={() => router.push("/dashboard")}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            handleGoBack();
            clickFeedback();
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Preview Transfer</h1>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4 rounded-lg bg-gray-50 p-6 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Sending to</p>
            <p className="font-medium">{recipient}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Amount</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                $
                {Number(amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-gray-500">USD</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Network Fee</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex justify-between border-t py-2">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-medium">
              $
              {Number(amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
        
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
          onClick={handleConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Confirm Transfer"}
          {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        
        <Disclaimer />
      </div>
    </div>
  );
};

export default PreviewTransfer;
