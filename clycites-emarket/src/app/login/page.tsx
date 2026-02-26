"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/use-toast";
import { AuthShell } from "@/components/layout/AuthShell";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast({ title: "Welcome back!", variant: "success" });
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    }
  };

  return (
    <AuthShell
      title="Trade smarter with trusted agri supply."
      subtitle="Access your marketplace dashboard, offers, and orders from one secure workspace."
    >
      <div className="mb-6 text-center sm:text-left">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 lg:hidden">
          <Leaf className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">ClyCites e-Market</span>
        </div>
        <h1 className="font-display text-3xl leading-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Log in</CardTitle>
          <CardDescription>Enter your email and password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-foreground transition-colors">
            Forgot password?
          </Link>
          <p>Don&apos;t have an account? <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link></p>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
