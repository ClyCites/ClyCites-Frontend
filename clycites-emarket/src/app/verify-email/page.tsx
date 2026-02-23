"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShoppingBasket, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api/endpoints/auth.api";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading"
  );
  const [message, setMessage] = useState(
    !token ? "Invalid or missing verification token" : ""
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        setTimeout(() => router.push("/login"), 4000);
      } catch (err: unknown) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Email verification failed");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <ShoppingBasket className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">Email Verification</h1>
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {status === "loading" && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
              {status === "success" && <CheckCircle className="h-6 w-6 text-primary" />}
              {status === "error" && <XCircle className="h-6 w-6 text-destructive" />}
            </div>
            <CardTitle className="text-lg">
              {status === "loading" && "Verifying your email..."}
              {status === "success" && "Email verified!"}
              {status === "error" && "Verification failed"}
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2">
            {status === "success" && (
              <Button className="w-full" asChild>
                <Link href="/login">Continue to Login</Link>
              </Button>
            )}
            {status === "error" && (
              <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Back to Sign Up</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
