"use client";

import { useEffect } from "react";
import { useAuth } from "~/providers/auth-provider";

/**
 * Custom hook to trigger user activity events
 * This can be used on sensitive pages to make sure the session
 * activity is refreshed when the component mounts
 */
export function useSessionActivity() {
  const { refreshSession } = useAuth();
  
  useEffect(() => {
    // Refresh session when component mounts
    refreshSession();
    
    // Also refresh session every 2 minutes while on this page
    const intervalId = setInterval(() => {
      refreshSession();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshSession]);
  
  // Provide a manual refresh function for explicit calls
  return { refreshActivity: refreshSession };
} 