"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, UserRound } from "lucide-react";
import { authService, securityService } from "@/lib/api";
import type { RegisterAccountPayload, RegistrationAccountType } from "@/lib/auth/types";
import { WORKSPACES } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

const defaultModules = ["farmer", "marketplace", "logistics", "finance", "weather", "prices"] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useMockSession();

  const [accountType, setAccountType] = useState<RegistrationAccountType>("sole");
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Uganda");
  const [region, setRegion] = useState("");

  const [primaryCommodity, setPrimaryCommodity] = useState("Maize");
  const [farmSizeAcres, setFarmSizeAcres] = useState(5);

  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState<"cooperative" | "agribusiness" | "ngo" | "government" | "exporter">("cooperative");
  const [teamSize, setTeamSize] = useState(12);
  const [enabledModules, setEnabledModules] = useState<string[]>([...defaultModules]);

  const progressValue = useMemo(() => (step === 1 ? 45 : 100), [step]);

  const toggleModule = (workspaceId: string, checked: boolean) => {
    setEnabledModules((current) => {
      if (checked) {
        return current.includes(workspaceId) ? current : [...current, workspaceId];
      }
      return current.filter((item) => item !== workspaceId);
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload: RegisterAccountPayload =
        accountType === "sole"
          ? {
              accountType,
              fullName,
              email,
              password,
              phone,
              country,
              region,
              primaryCommodity,
              farmSizeAcres,
            }
          : {
              accountType,
              fullName,
              email,
              password,
              phone,
              country,
              region,
              organizationName,
              organizationType,
              teamSize,
              enabledModules: enabledModules as WorkspaceId[],
            };

      await authService.register(payload);
      const session = await login(email, password);

      const primaryWorkspace =
        accountType === "organization"
          ? ((enabledModules[0] as WorkspaceId | undefined) ?? "farmer")
          : "farmer";

      await securityService.saveOnboarding(session.user.id, {
        accountType,
        preferredLanguage: "English",
        region,
        primaryWorkspace,
        goals:
          accountType === "organization"
            ? ["Track marketplace performance", "Strengthen financial controls"]
            : ["Improve production planning", "Monitor weather risk"],
        notificationChannels: {
          email: true,
          sms: false,
          inApp: true,
        },
      });

      toast({ title: "Registration complete", description: "Your workspace is ready.", variant: "success" });
      router.replace("/app");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unable to complete registration",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
      <Card className="w-full panel-surface">
        <CardHeader>
          <div className="mb-2">
            <Image src="/logo.png" alt="ClyCites" width={752} height={927} className="h-16 w-auto" priority />
          </div>
          <CardTitle>Create ClyCites Account</CardTitle>
          <CardDescription>Register as a sole operator or an organization and start directly in your dashboard.</CardDescription>
          <Progress value={progressValue} className="mt-2" />
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={submit}>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setAccountType("sole")}
                className={`rounded-xl border p-3 text-left transition ${
                  accountType === "sole" ? "border-primary bg-primary/10" : "border-border/60 bg-background/55"
                }`}
              >
                <div className="mb-1 inline-flex items-center gap-2 font-medium">
                  <UserRound className="h-4 w-4" /> Sole Operator
                </div>
                <p className="text-xs text-muted-foreground">Best for individual farmers and micro-operators.</p>
              </button>
              <button
                type="button"
                onClick={() => setAccountType("organization")}
                className={`rounded-xl border p-3 text-left transition ${
                  accountType === "organization" ? "border-primary bg-primary/10" : "border-border/60 bg-background/55"
                }`}
              >
                <div className="mb-1 inline-flex items-center gap-2 font-medium">
                  <Building2 className="h-4 w-4" /> Organization
                </div>
                <p className="text-xs text-muted-foreground">For cooperatives, agribusinesses, and institutions.</p>
              </button>
            </div>

            {step === 1 && (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(event) => setPhone(event.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Input value={country} onChange={(event) => setCountry(event.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Region</Label>
                  <Input value={region} onChange={(event) => setRegion(event.target.value)} required />
                </div>
              </div>
            )}

            {step === 2 && accountType === "sole" && (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Primary commodity</Label>
                  <Input value={primaryCommodity} onChange={(event) => setPrimaryCommodity(event.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Farm size (acres)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={farmSizeAcres}
                    onChange={(event) => setFarmSizeAcres(Number(event.target.value))}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && accountType === "organization" && (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Organization name</Label>
                    <Input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Organization type</Label>
                    <Select value={organizationType} onValueChange={(value) => setOrganizationType(value as typeof organizationType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cooperative">Cooperative</SelectItem>
                        <SelectItem value="agribusiness">Agribusiness</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="exporter">Exporter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Team size</Label>
                    <Input type="number" min={1} value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Provision workspaces</Label>
                  <div className="grid gap-2 rounded-xl border border-border/60 bg-background/55 p-3 sm:grid-cols-2">
                    {WORKSPACES.map((workspace) => {
                      const checked = enabledModules.includes(workspace.id);
                      return (
                        <label key={workspace.id} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={checked} onCheckedChange={(value) => toggleModule(workspace.id, Boolean(value))} />
                          <span>{workspace.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
              <div className="flex gap-2">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                )}
                {step === 1 ? (
                  <Button type="button" onClick={() => setStep(2)}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit">Register and Continue</Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
