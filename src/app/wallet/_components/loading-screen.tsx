"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full max-w-md">
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center justify-center text-center text-3xl font-bold">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Druid
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Loading your account data...
        </p>
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Loading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
