// This is a placeholder hook to replace Telegram-specific haptic feedback

type FeedbackType = "soft" | "medium" | "heavy" | "success" | "error" | "warning" | "selectionChanged";

export function useHapticFeedback() {
  // These functions are no-ops in the web app
  const impactOccurred = () => {};
  const notificationOccurred = () => {};
  const selectionChanged = () => {};
  const clickFeedback = (intensity?: FeedbackType) => {};

  return {
    impactOccurred,
    notificationOccurred,
    selectionChanged,
    clickFeedback,
  };
} 