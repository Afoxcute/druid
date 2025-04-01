import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Nunito } from 'next/font/google';
import { Inter } from "next/font/google";
import { LanguageProvider } from "~/contexts/LanguageContext";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";

import { TRPCReactProvider } from "~/trpc/react";
import ToasterProvider from "~/providers/toaster-provider";
import { AuthProvider } from "~/providers/auth-provider";
import Background from "~/app/components/background";

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freelii",
  description: "Send and receive money instantly",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${nunito.variable} ${inter.className}`}>
      <body className="min-h-screen font-sans antialiased">
        <LanguageProvider>
          <TRPCReactProvider>
            <ToasterProvider />
            <AuthProvider>
              <div className="min-h-screen bg-gray-50">
                <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                  <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h1 className="text-xl font-bold">Freelii</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </header>
                <main className="container py-6">
                  <Background>
                    {children}
                  </Background>
                </main>
              </div>
            </AuthProvider>
          </TRPCReactProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
