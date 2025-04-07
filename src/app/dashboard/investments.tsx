"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Progress } from "~/components/ui/progress";
import { ArrowUpRight, TrendingUp, DollarSign, Percent } from "lucide-react";
import { toast } from "react-hot-toast";

// Mock investment options
const investmentOptions = [
  {
    id: "savings",
    name: "High-Yield Savings",
    description: "Earn interest on your savings with FDIC insurance",
    apy: "4.5%",
    risk: "Low",
    minAmount: 100,
    liquidity: "High",
  },
  {
    id: "bonds",
    name: "Government Bonds",
    description: "Secure investment backed by government",
    apy: "5.2%",
    risk: "Low-Medium",
    minAmount: 1000,
    liquidity: "Medium",
  },
  {
    id: "stocks",
    name: "Stock Market ETF",
    description: "Diversified portfolio of top companies",
    apy: "7.8%",
    risk: "Medium",
    minAmount: 500,
    liquidity: "Medium",
  },
  {
    id: "crypto",
    name: "Crypto Savings",
    description: "Earn interest on your cryptocurrency holdings",
    apy: "8.5%",
    risk: "Medium-High",
    minAmount: 200,
    liquidity: "Medium",
  },
];

export default function Investments() {
  const [selectedOption, setSelectedOption] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvest = () => {
    if (!selectedOption) {
      toast.error("Please select an investment option");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const option = investmentOptions.find((opt) => opt.id === selectedOption);
    if (!option) {
      toast.error("Selected investment option not found");
      return;
    }
    
    if (numAmount < option.minAmount) {
      toast.error(`Minimum investment amount is $${option.minAmount}`);
      return;
    }

    setLoading(true);
    
    // Simulate investment process
    setTimeout(() => {
      toast.success(`Successfully invested $${numAmount} in ${option.name}`);
      setAmount("");
      setSelectedOption("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Investments</h2>
        <Button variant="outline" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Performance
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Investment Options</CardTitle>
            <CardDescription>
              Choose from our curated selection of investment products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="investment-type">Investment Type</Label>
              <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger id="investment-type">
                  <SelectValue placeholder="Select an investment option" />
                </SelectTrigger>
                <SelectContent>
                  {investmentOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name} - {option.apy} APY
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedOption && (
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">
                  {investmentOptions.find((opt) => opt.id === selectedOption)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {investmentOptions.find((opt) => opt.id === selectedOption)?.description}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">APY:</span>{" "}
                    <span className="font-medium text-green-600">
                      {investmentOptions.find((opt) => opt.id === selectedOption)?.apy}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risk:</span>{" "}
                    <span className="font-medium">
                      {investmentOptions.find((opt) => opt.id === selectedOption)?.risk}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min Amount:</span>{" "}
                    <span className="font-medium">
                      ${investmentOptions.find((opt) => opt.id === selectedOption)?.minAmount}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Liquidity:</span>{" "}
                    <span className="font-medium">
                      {investmentOptions.find((opt) => opt.id === selectedOption)?.liquidity}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleInvest}
              disabled={loading || !selectedOption || !amount}
            >
              {loading ? "Processing..." : "Invest Now"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Investment Portfolio</CardTitle>
            <CardDescription>
              Track your investments and returns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Invested</span>
                <span className="text-sm font-medium">$12,500</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Returns</span>
                <span className="text-sm font-medium text-green-600">+$875 (7%)</span>
              </div>
              <Progress value={7} className="h-2 bg-green-100" />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Asset Allocation</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm">High-Yield Savings</span>
                  </div>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Percent className="mr-2 h-4 w-4 text-purple-500" />
                    <span className="text-sm">Government Bonds</span>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">Stock Market ETF</span>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowUpRight className="mr-2 h-4 w-4 text-orange-500" />
                    <span className="text-sm">Crypto Savings</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 