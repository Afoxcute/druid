"use client";

import { createContext, useContext, ReactNode } from "react";

interface HapticFeedbackContextType {
  clickFeedback: (intensity?: "light" | "medium" | "heavy") => void;
}

const HapticFeedbackContext = createContext<HapticFeedbackContextType>({
  clickFeedback: () => {},
});

export function HapticFeedbackProvider({ children }: { children: ReactNode }) {
  const clickFeedback = (intensity: "light" | "medium" | "heavy" = "medium") => {
    // In a real app, this would use the device's haptic feedback API
    // For now, we'll just log the interaction
    console.log(`Haptic feedback: ${intensity}`);
  };

  return (
    <HapticFeedbackContext.Provider value={{ clickFeedback }}>
      {children}
    </HapticFeedbackContext.Provider>
  );
}

export function useHapticFeedback() {
  return useContext(HapticFeedbackContext);
} 