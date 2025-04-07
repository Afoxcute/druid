"use client";
import { Suspense } from "react";

export default function InvestmentDetailsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-md p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Loading investment details...</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
} 