"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "~/providers/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: number;
  recipient: string;
  date: string;
}

// Mock transactions for demonstration
const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "send",
    amount: 20,
    recipient: "John Doe",
    date: "2023-06-15",
  },
  {
    id: "tx2",
    type: "receive",
    amount: 50,
    recipient: "Alice Smith",
    date: "2023-06-10",
  },
  {
    id: "tx3",
    type: "send",
    amount: 15,
    recipient: "Bob Johnson",
    date: "2023-06-05",
  },
];

// Create a separate component that uses useSearchParams
function DashboardContent() {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [balance] = useState("1,234.56"); // Mock balance
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPinVerified, setIsPinVerified] = useState(false);
  
  // Check if user is coming from bank connection flow
  const bankConnected = searchParams.get("bankConnected") === "true";
  
  useEffect(() => {
    // In a real app, this would check a session value or token
    // For demo purposes, we'll just set a timer to simulate PIN verification
    const timer = setTimeout(() => {
      setIsPinVerified(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // If the user isn't loaded yet, show a loading state
  if (!user) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  // If PIN isn't verified, redirect to PIN page
  if (!isPinVerified) {
    router.push("/auth/pin?redirectTo=/dashboard");
    return <div className="flex justify-center p-8">Verifying security...</div>;
  }

  return (
    <div className="container mx-auto max-w-md space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Welcome, {user.firstName || "User"}
        </h1>
        <Button variant="ghost" onClick={() => {
          logout();
          router.push("/auth/signin");
        }}>
          Logout
        </Button>
      </div>

      {bankConnected && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
          Bank account successfully connected! You can now make transfers.
        </div>
      )}

      <Card className="overflow-hidden bg-blue-600 text-white">
        <CardContent className="p-6">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-blue-100">Current Balance</h2>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">
                ${showBalance ? balance : "••••••"}
              </p>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="rounded-full p-1 hover:bg-blue-500"
              >
                {showBalance ? (
                  <EyeOff className="h-4 w-4 text-blue-100" />
                ) : (
                  <Eye className="h-4 w-4 text-blue-100" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="bg-blue-500 text-white hover:bg-blue-400 border-blue-400"
              onClick={() => router.push("/send")}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button 
              variant="outline" 
              className="bg-blue-500 text-white hover:bg-blue-400 border-blue-400"
              onClick={() => router.push("/receive")}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4 pt-4">
          {mockTransactions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <Card key={tx.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === "receive" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                          {tx.type === "receive" ? (
                            <ArrowDownToLine className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.recipient}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${tx.type === "receive" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "receive" ? "+" : "-"}${tx.amount}
                        </p>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="banking" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <p className="text-lg font-medium">Connect your bank account</p>
                <p className="text-sm text-gray-500">
                  Link your bank for faster transfers and withdrawals
                </p>
              </div>
              <Button 
                className="w-full"
                onClick={() => router.push("/banking/connect")}
              >
                Connect Bank
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component with Suspense boundary
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
} 