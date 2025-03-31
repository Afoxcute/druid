"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { WaitlistForm } from "~/app/components/waitlist-form";
import { Globe } from "~/app/components/globe";

export default function LandingPage() {
  const router = useRouter();
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <Globe />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="mb-6 font-nunito text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            The Future of <span className="text-blue-400">Global</span> Payments
                      </h1>
          <p className="mb-8 text-lg text-gray-200">
            Send money instantly to anyone, anywhere in the world without fees or borders.
            Backed by secure blockchain technology.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Button 
              onClick={() => router.push("/auth/signin")}
              className="bg-blue-600 px-8 py-3 text-lg hover:bg-blue-700"
            >
              Sign In
            </Button>
                    <Button 
              onClick={() => router.push("/auth/signup")}
              variant="outline" 
              className="border-white px-8 py-3 text-lg text-white hover:bg-white/10"
            >
              Create Account
                    </Button>
                </div>
              </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Druid</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-semibold">No Hidden Fees</h3>
              <p className="text-gray-600">
                Send money internationally without expensive transfer fees or hidden charges.
              </p>
                </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-semibold">Instant Transfers</h3>
              <p className="text-gray-600">
                Money arrives in seconds, not days. No more waiting for international clearance.
              </p>
              </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-semibold">Bank-Level Security</h3>
              <p className="text-gray-600">
                Your funds are protected with state-of-the-art encryption and blockchain technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="bg-blue-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Coming Soon: Banking Features</h2>
            <p className="mb-8">
              We're adding direct bank transfers, virtual cards, and more. Join our waitlist to be the first to know.
            </p>
            {showWaitlist ? (
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <WaitlistForm />
              </div>
            ) : (
              <Button
                onClick={() => setShowWaitlist(true)}
                className="bg-white px-8 py-3 text-blue-900 hover:bg-gray-100"
              >
                Join the Waitlist
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 text-center text-white">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-2xl font-bold">Druid</p>
          <p className="mb-4 text-sm text-gray-400">
            Send money instantly to anyone, anywhere.
          </p>
          <div className="mb-6 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact</a>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Druid. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
