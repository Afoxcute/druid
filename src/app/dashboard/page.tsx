"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Eye, EyeOff, Receipt, TrendingUp } from "lucide-react";
import { useAuth } from "~/providers/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { shortStellarAddress } from "~/lib/utils";
import { toast } from "react-hot-toast";
import Investments from "./investments";

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
  const [balance] = useState("673,000.56"); // Mock balance
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // Check if user is coming from bank connection flow
  const bankConnected = searchParams.get("bankConnected") === "true";
  
  // Check if the pin was already verified in this session
  const pinVerified = searchParams.get("pinVerified") === "true";
  
  useEffect(() => {
    // If coming from the PIN verification page with success
    if (pinVerified) {
      setIsPinVerified(true);
      setIsVerifying(false);
      return;
    }
    
    // Check if user has a PIN set
    const timer = setTimeout(async () => {
      if (user) {
        console.log("Checking if user has PIN set:", user);
        
        // Force reload user data from localStorage to get the latest changes
        try {
          const userData = localStorage.getItem("auth_user");
          if (userData) {
            const refreshedUser = JSON.parse(userData);
            console.log("Refreshed user data:", refreshedUser);
            
            // Check if hashedPin is null (no PIN set)
            if (refreshedUser.hashedPin === null) {
              console.log("User has no PIN set, redirecting to PIN setup");
              router.replace("/wallet/onboarding/" + user.id);
              return;
            }
            
            // If redirected from PIN page, check for passkey setup
            // Allow "skipped_setup" as a valid passkey state
            if (pinVerified && 
                (!refreshedUser.passkeyCAddress || 
                refreshedUser.passkeyCAddress === null) && 
                refreshedUser.passkeyCAddress !== "skipped_setup") {
              console.log("User has no passkey set, redirecting to passkey setup");
              router.replace(`/wallet/onboarding/${user.id}/passkey`);
              return;
            }

            // Check if user has a wallet address
            if (!refreshedUser.walletAddress) {
              // Generate a unique wallet address for the user
              const newAddress = `stellar:${Math.random().toString(36).substring(2, 15)}`;
              refreshedUser.walletAddress = newAddress;
              localStorage.setItem("auth_user", JSON.stringify(refreshedUser));
              setWalletAddress(newAddress);
            } else {
              setWalletAddress(refreshedUser.walletAddress);
            }
            
            // PIN and passkey verification passed
            setIsPinVerified(true);
            setIsVerifying(false);
          }
        } catch (err) {
          console.error("Error refreshing user data:", err);
          // PIN is set, proceed with verification
          setIsPinVerified(true);
          setIsVerifying(false);
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [pinVerified, user, router]);
  
  // If the user isn't loaded yet, show a loading state
  if (!user) {
    return <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mb-4"></div>
      <p>Loading user data...</p>
    </div>;
  }
  
  // Show verifying message while checking
  if (isVerifying) {
    return <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mb-4"></div>
      <p>Verifying security...</p>
    </div>;
  }
  
  // If PIN isn't verified and we haven't already redirected, redirect to PIN page
  if (!isPinVerified && !pinVerified && !redirected) {
    console.log("Redirecting to PIN verification page");
    setRedirected(true); // Set flag to prevent multiple redirects
    
    // Use a setTimeout to allow the state update to complete before redirecting
    setTimeout(() => {
      router.replace("/auth/pin?redirectTo=/dashboard?pinVerified=true");
    }, 100);
    
    return <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mb-4"></div>
      <p>Redirecting to PIN verification...</p>
    </div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {showBalance ? "Hide Balance" : "Show Balance"}
          </Button>
          <Button onClick={logout}>Logout</Button>
        </div>
      </div>

      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <h2 className="text-3xl font-bold">
                  {showBalance ? `$${balance}` : "****"}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Receive
                </Button>
                <Button>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="investments">
            <TrendingUp className="mr-2 h-4 w-4" />
            Investments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Overview content */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sent</p>
                    <h3 className="text-2xl font-bold">$1,250.00</h3>
                  </div>
                  <div className="rounded-full bg-red-100 p-2">
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Received</p>
                    <h3 className="text-2xl font-bold">$3,750.00</h3>
                  </div>
                  <div className="rounded-full bg-green-100 p-2">
                    <ArrowDownToLine className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Count</p>
                    <h3 className="text-2xl font-bold">24</h3>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          {/* Transactions content */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          transaction.type === "send"
                            ? "bg-red-100"
                            : "bg-green-100"
                        }`}
                      >
                        {transaction.type === "send" ? (
                          <ArrowUpRight
                            className={`h-5 w-5 ${
                              transaction.type === "send"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          />
                        ) : (
                          <ArrowDownToLine
                            className={`h-5 w-5 ${
                              transaction.type === "receive"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === "send"
                            ? `Sent to ${transaction.recipient}`
                            : `Received from ${transaction.recipient}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${
                        transaction.type === "send"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.type === "send" ? "-" : "+"}$
                      {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="investments">
          <Investments />
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