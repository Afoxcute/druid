import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Nunito } from 'next/font/google';

import { TRPCReactProvider } from "~/trpc/react";
import ToasterProvider from "~/providers/toaster-provider";
import { AuthProvider } from "~/providers/auth-provider";
import Background from "./components/background";

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: "Druid - Modern Digital Payments",
  description: "Send money to your friends and family with Druid's secure and instant digital payments platform.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Druid - Modern Digital Payments",
    description: "Send money to your friends and family with Druid's secure and instant digital payments platform.",
    url: "https://druid.app",
    images: [
      {
        url: "https://druid.app/api/og?title=Druid&description=Modern%20Digital%20Payments",
        width: 1200,
        height: 630,
        alt: "Druid - Modern Digital Payments",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${nunito.variable} dark`}>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <TRPCReactProvider>
          <ToasterProvider />
          <AuthProvider>
            <Background>
              {children}
            </Background>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
