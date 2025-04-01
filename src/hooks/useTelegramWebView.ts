"use client";

import { useAuth } from "~/providers/auth-provider";

// This replaces the Telegram-specific integration
export default function useTelegramWebView() {
  const { user } = useAuth();

  return {
    user: user ? {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.email || user.phone,
    } : null,
    ready: !!user,
  };
} 