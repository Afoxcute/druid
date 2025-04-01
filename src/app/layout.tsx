import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Nunito } from 'next/font/google';
import Link from "next/link";

import { TRPCReactProvider } from "~/trpc/react";
import ToasterProvider from "~/providers/toaster-provider";
import { AuthProvider } from "~/providers/auth-provider";
import Background from "./components/background";
import { LanguageProvider } from "~/contexts/LanguageContext";
import { LanguageSelector } from "~/components/LanguageSelector";

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: "Druid",
  description: "Send money to your friends and family",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${nunito.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <LanguageProvider>
          <TRPCReactProvider>
            <ToasterProvider />
            <AuthProvider>
              <Background>
                <div className="min-h-screen bg-gray-50">
                  <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between h-16">
                        <div className="flex items-center">
                          <Link href="/" className="text-xl font-bold text-blue-600">
                            Freelii
                          </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                          <LanguageSelector />
                        </div>
                      </div>
                    </div>
                  </nav>
                  <main>{children}</main>
                </div>
              </Background>
            </AuthProvider>
          </TRPCReactProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
