"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { authService } from "@/lib/api/mock";
import { useMockSession } from "@/lib/auth/mock-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function MockLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useMockSession();
  const [email, setEmail] = useState("ops@clycites.io");
  const [password, setPassword] = useState("ops12345");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(email, password);
      toast({ title: "Signed in", variant: "success" });
      const nextPath =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
      router.replace(nextPath || "/app");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid credentials";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10">
      <div className="grid w-full gap-8 lg:grid-cols-2">
        <div className="hidden flex-col justify-center rounded-3xl border bg-card/70 p-10 lg:flex">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border bg-primary/10 text-primary">
            <Leaf className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">ClyCites Multi-Workspace Control Plane</h1>
          <p className="mt-3 text-muted-foreground">
            Full value-chain and intelligence workspaces with typed mock backend services and persistent local storage.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {authService.getCredentials().map((credential) => (
              <li key={credential.email}>
                <span className="font-medium text-foreground">{credential.email}</span> / {credential.password}
              </li>
            ))}
          </ul>
        </div>

        <Card className="panel-surface">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use one of the seeded mock accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <Button className="w-full" type="submit" loading={isLoading}>
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
