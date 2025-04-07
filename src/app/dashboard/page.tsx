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
  const { user, logout, refreshUserData } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [balance] = useState("673,000.56"); // Mock balance
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    // Initialize wallet address from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem("auth_user");
        if (userData) {
          const user = JSON.parse(userData);
          if (user.walletAddress) {
            console.log("INITIALIZING WALLET ADDRESS FROM STORAGE:", user.walletAddress);
            return user.walletAddress;
          }
        }
      } catch (error) {
        console.error("Error initializing wallet address from localStorage:", error);
      }
    }
    return null;
  });
  
  // Immediately generate wallet address if needed
  useEffect(() => {
    const ensureWalletAddress = () => {
      try {
        const userData = localStorage.getItem("auth_user");
        if (userData) {
          const localUser = JSON.parse(userData);
          if (!localUser.walletAddress) {
            // Generate a unique wallet address for the user
            const newAddress = `stellar:${Math.random().toString(36).substring(2, 15)}`;
            localUser.walletAddress = newAddress;
            localStorage.setItem("auth_user", JSON.stringify(localUser));
            console.log("IMMEDIATE WALLET ADDRESS GENERATION:", newAddress);
            setWalletAddress(newAddress);
            return true;
          } else if (localUser.walletAddress && !walletAddress) {
            // If we have a wallet address in local storage but not in state, set it
            setWalletAddress(localUser.walletAddress);
            console.log("FOUND EXISTING WALLET ADDRESS:", localUser.walletAddress);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error ensuring wallet address:", error);
        return false;
      }
    };

    // Try to set wallet address immediately
    const addressSet = ensureWalletAddress();
    console.log("Initial wallet address check result:", addressSet);
  }, [walletAddress]);
  
  // Check if user is coming from bank connection flow
  const bankConnected = searchParams.get("bankConnected") === "true";
  
  // Check if user is coming from investment success
  const investmentSuccess = searchParams.get("investmentSuccess") === "true";
  
  // Check if the pin was already verified in this session
  const pinVerified = searchParams.get("pinVerified") === "true";
  
  useEffect(() => {
    console.log("Wallet address state:", walletAddress);
  }, [walletAddress]);
  
  useEffect(() => {
    // If coming from the PIN verification page with success
    if (pinVerified) {
      setIsPinVerified(true);
      setIsVerifying(false);
      
      // Check if we need to generate a wallet address
      try {
        const userData = localStorage.getItem("auth_user");
        if (userData) {
          const user = JSON.parse(userData);
          if (!user.walletAddress) {
            const newAddress = `stellar:${Math.random().toString(36).substring(2, 15)}`;
            user.walletAddress = newAddress;
            localStorage.setItem("auth_user", JSON.stringify(user));
            setWalletAddress(newAddress);
            console.log("PIN VERIFIED, GENERATED NEW WALLET ADDRESS:", newAddress);
          } else if (!walletAddress) {
            setWalletAddress(user.walletAddress);
            console.log("PIN VERIFIED, USING EXISTING WALLET ADDRESS:", user.walletAddress);
          }
        }
      } catch (error) {
        console.error("Error checking wallet address after PIN verification:", error);
      }
      
      return;
    }
    
    // Check if user has a PIN set
    const timer = setTimeout(async () => {
      if (user) {
        console.log("Checking if user has PIN set:", user);
        
        try {
          // First, try to get fresh data from the server
          if (user.id) {
            console.log("Refreshing user data from server");
            const freshUser = await refreshUserData(user.id);
            
            if (freshUser) {
              console.log("Got fresh user data:", freshUser);
              
              // Check if hashedPin is set in the fresh data
              const hasPinSet = freshUser.hashedPin !== null && 
                                freshUser.hashedPin !== undefined &&
                                freshUser.hashedPin !== '';
              
              if (!hasPinSet) {
                console.log("Server data shows no PIN set, redirecting to PIN setup");
                router.replace("/wallet/onboarding/" + user.id);
                return;
              }
              
              console.log("Server data confirms PIN is set");
              
              // Check for passkey if needed
              if (pinVerified && 
                  (!freshUser.passkeyCAddress || 
                  freshUser.passkeyCAddress === null) && 
                  freshUser.passkeyCAddress !== "skipped_setup") {
                console.log("Server data shows no passkey set, redirecting to passkey setup");
                router.replace(`/wallet/onboarding/${user.id}/passkey`);
                return;
              }
              
              // Set wallet address if available or generate one if not
              if (freshUser.walletAddress) {
                setWalletAddress(freshUser.walletAddress);
              } else {
                // Generate a wallet address if server doesn't provide one
                const newAddress = `stellar:${Math.random().toString(36).substring(2, 15)}`;
                console.log("Server data missing wallet address, generating one:", newAddress);
                
                // Update state immediately
                setWalletAddress(newAddress);
                
                // Try to update the user record
                try {
                  // Update our local copy of the user data
                  freshUser.walletAddress = newAddress;
                  localStorage.setItem("auth_user", JSON.stringify(freshUser));
                } catch (updateErr) {
                  console.error("Error updating local user data with new wallet address:", updateErr);
                }
              }
              
              // All checks passed
              setIsPinVerified(true);
              setIsVerifying(false);
              return;
            }
          }
          
          // If server refresh fails or returns no data, fallback to localStorage
          console.log("Falling back to localStorage check");
          const userData = localStorage.getItem("auth_user");
          if (userData) {
            const refreshedUser = JSON.parse(userData);
            console.log("Local storage user data:", refreshedUser);
            
            // Check if PIN is set - hashedPin could be null/undefined or empty string if not set
            const hasPinSet = refreshedUser.hashedPin !== null && 
                              refreshedUser.hashedPin !== undefined && 
                              refreshedUser.hashedPin !== '';
            
            if (!hasPinSet) {
              console.log("Local data shows no PIN set, redirecting to PIN setup");
              router.replace("/wallet/onboarding/" + user.id);
              return;
            }
            
            console.log("Local data confirms PIN is set, hashedPin present:", !!refreshedUser.hashedPin);
            
            // If redirected from PIN page, check for passkey setup
            // Allow "skipped_setup" as a valid passkey state
            if (pinVerified && 
                (!refreshedUser.passkeyCAddress || 
                refreshedUser.passkeyCAddress === null) && 
                refreshedUser.passkeyCAddress !== "skipped_setup") {
              console.log("Local data shows no passkey set, redirecting to passkey setup");
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
              console.log("Generated new wallet address:", newAddress);
            } else {
              setWalletAddress(refreshedUser.walletAddress);
              console.log("Using existing wallet address:", refreshedUser.walletAddress);
            }
            
            // PIN and passkey verification passed
            setIsPinVerified(true);
            setIsVerifying(false);
          }
        } catch (err) {
          console.error("Error checking user PIN status:", err);
          // On error, assume PIN is set to prevent redirect loops
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
    <div className="container mx-auto max-w-md space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Welcome, {user.firstName || "User"}
        </h1>
        <Button variant="ghost" onClick={() => {
          // Clear any session/verification data
          setIsPinVerified(false);
          // Log the user out
          logout();
          // Redirect to sign in
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

      {investmentSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
          Your investment was successful! You can track it in your portfolio.
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
              onClick={() => {
                if (walletAddress) {
                  router.push(`/dashboard/${walletAddress}/send`);
                } else {
                  toast.error("Please wait while we set up your wallet address");
                }
              }}
              disabled={!walletAddress}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button 
              variant="outline" 
              className="bg-blue-500 text-white hover:bg-blue-400 border-blue-400"
              onClick={() => router.push(`/wallet/${walletAddress}/receive`)}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </div>
          {walletAddress && (
            <div className="mt-4 text-center text-sm text-blue-100">
              Wallet Address: {shortStellarAddress(walletAddress)}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="cursor-pointer transition-colors hover:bg-gray-50" onClick={() => router.push(`/dashboard/${walletAddress}/send`)}>
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <ArrowUpRight className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Send Money</h3>
              <p className="text-sm text-gray-500">Transfer to others</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-gray-50" onClick={() => router.push(`/wallet/${walletAddress}/receive`)}>
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <ArrowDownToLine className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Receive Money</h3>
              <p className="text-sm text-gray-500">Get paid by others</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-gray-50" onClick={() => router.push(`/dashboard/${walletAddress}/bills`)}>
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Receipt className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Pay Bills</h3>
              <p className="text-sm text-gray-500">Pay utilities & more</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-gray-50" onClick={() => router.push(`/dashboard/${walletAddress}/investments`)}>
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold">Invest</h3>
              <p className="text-sm text-gray-500">Grow your money</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
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

        <TabsContent value="investments" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Investment Portfolio</h3>
                  <p className="text-sm text-gray-500">
                    Invest your money and watch it grow
                  </p>
                </div>
              </div>

              {/* Investment Growth Overview */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Invested</span>
                  <span className="font-bold">$1,250.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Current Value</span>
                  <span className="font-bold text-green-600">$1,387.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Return</span>
                  <span className="font-bold text-green-600">+$137.50 (11%)</span>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => router.push(`/dashboard/${walletAddress}/investments`)}
              >
                View Investment Options
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