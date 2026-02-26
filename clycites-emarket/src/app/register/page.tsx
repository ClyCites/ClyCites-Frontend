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
import { authApi } from "@/lib/api/endpoints/auth.api";
import { toast } from "@/components/ui/use-toast";
import { AuthShell } from "@/components/layout/AuthShell";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const [firstName, ...restParts] = data.name.trim().split(" ");
      const lastName = restParts.join(" ") || firstName;
      await authApi.register({ firstName, lastName, email: data.email, password: data.password });
      toast({ title: "Account created!", description: "Please log in.", variant: "success" });
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast({ title: "Sign up failed", description: message, variant: "destructive" });
    }
  };

  return (
    <AuthShell
      title="Create your workspace and start trading."
      subtitle="Set up your account to access listings, make offers, and manage deliveries."
    >
      <div className="mb-6 text-center sm:text-left">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 lg:hidden">
          <Leaf className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">ClyCites e-Market</span>
        </div>
        <h1 className="font-display text-3xl leading-tight">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join the marketplace in a few steps.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Sign up</CardTitle>
          <CardDescription>Fill in your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
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
            <div className="space-y-1.5">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" {...register("confirm")} />
              {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link></p>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
