"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have hash fragments in the URL (OAuth tokens)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");

        if (accessToken) {
          setTimeout(() => {
            setStatus("success");
            router.push("/dashboard");
          }, 2000);
        } else {
          // Fallback: check for existing session
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            throw error;
          }

          if (data.session) {
            setStatus("success");
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          } else {
            throw new Error("No authentication data found");
          }
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    handleAuthCallback();
  }, [router]);

  const LoadingState = () => (
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="text-center">
        <h2 className="text-lg font-semibold">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );

  const SuccessState = () => (
    <div className="flex flex-col items-center space-y-4">
      <CheckCircle className="h-8 w-8 text-green-500" />
      <div className="text-center">
        <h2 className="text-lg font-semibold text-green-700">
          Successfully signed in!
        </h2>
        <p className="text-sm text-muted-foreground">
          Redirecting you to the homepage...
        </p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center space-y-4">
      <XCircle className="h-8 w-8 text-red-500" />
      <div className="text-center">
        <h2 className="text-lg font-semibold text-red-700">
          Authentication failed
        </h2>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
      <Button onClick={() => router.push("/")} variant="outline">
        Return to homepage
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Authentication</CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          {status === "loading" && <LoadingState />}
          {status === "success" && <SuccessState />}
          {status === "error" && <ErrorState />}
        </CardContent>
      </Card>
    </div>
  );
}
