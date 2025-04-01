import * as React from "react";
import { toast as hotToast } from "react-hot-toast";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
}

interface UseToastReturn {
  toast: (props: ToastProps) => void;
}

export function useToast(): UseToastReturn {
  const toast = React.useCallback(({ title, description, variant = "default" }: ToastProps) => {
    const styles = {
      default: "bg-white text-gray-900",
      success: "bg-green-50 text-green-900",
      destructive: "bg-red-50 text-red-900",
    };

    const icon = {
      default: "ℹ️",
      success: "✅",
      destructive: "❌",
    };

    hotToast.custom(
      (t) => (
        <div
          className={`${styles[variant]} rounded-lg shadow-lg p-4 max-w-sm ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-lg">{icon[variant]}</span>
            </div>
            <div className="ml-3 w-0 flex-1">
              {title && (
                <p className="text-sm font-medium">{title}</p>
              )}
              {description && (
                <p className="mt-1 text-sm opacity-90">{description}</p>
              )}
            </div>
          </div>
        </div>
      ),
      {
        duration: 3000,
        position: "top-center",
      }
    );
  }, []);

  return { toast };
} 