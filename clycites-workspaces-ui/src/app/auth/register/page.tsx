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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164_PATTERN = /^\+?[1-9]\d{1,14}$/;

type FieldErrors = Partial<Record<"fullName" | "email" | "password" | "confirmPassword" | "phone" | "country" | "region", string>>;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string, country: string): string {
  let normalized = value.trim().replace(/[\s()-]/g, "");
  if (!normalized) return "";

  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  }

  const countryLower = country.trim().toLowerCase();
  if (countryLower === "uganda" && /^0\d{9}$/.test(normalized)) {
    normalized = `+256${normalized.slice(1)}`;
  }

  return normalized;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useMockSession();

  const [accountType, setAccountType] = useState<RegistrationAccountType>("sole");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const updateError = (key: keyof FieldErrors, value: string) => {
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
    switch (key) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "country":
        setCountry(value);
        break;
      case "region":
        setRegion(value);
        break;
      default:
        break;
    }
  };

  const validateStepOne = (): {
    valid: boolean;
    normalizedEmail: string;
    normalizedPhone: string;
    firstError?: string;
  } => {
    const nextErrors: FieldErrors = {};
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone, country);

    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      nextErrors.email = "Please provide a valid email.";
    }
    if (password.length < 12) {
      nextErrors.password = "Password must be at least 12 characters.";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (normalizedPhone && !E164_PATTERN.test(normalizedPhone)) {
      nextErrors.phone = "Use a valid phone number (E.164), e.g. +256700000000.";
    }
    if (!country.trim()) {
      nextErrors.country = "Country is required.";
    }
    if (!region.trim()) {
      nextErrors.region = "Region is required.";
    }

    setErrors(nextErrors);
    const firstError = Object.values(nextErrors).find((value): value is string => typeof value === "string");

    return {
      valid: Object.keys(nextErrors).length === 0,
      normalizedEmail,
      normalizedPhone,
      firstError,
    };
  };

  const validateStepTwo = (): boolean => {
    if (accountType === "sole") {
      if (!primaryCommodity.trim()) {
        toast({ title: "Primary commodity is required", variant: "destructive" });
        return false;
      }
      if (!Number.isFinite(farmSizeAcres) || farmSizeAcres < 1) {
        toast({ title: "Farm size must be at least 1 acre", variant: "destructive" });
        return false;
      }
      return true;
    }

    if (!organizationName.trim()) {
      toast({ title: "Organization name is required", variant: "destructive" });
      return false;
    }
    if (!Number.isFinite(teamSize) || teamSize < 1) {
      toast({ title: "Team size must be at least 1", variant: "destructive" });
      return false;
    }
    if (enabledModules.length === 0) {
      toast({ title: "Select at least one workspace module", variant: "destructive" });
      return false;
    }
    return true;
  };

  const toggleModule = (workspaceId: string, checked: boolean) => {
    setEnabledModules((current) => {
      if (checked) {
        return current.includes(workspaceId) ? current : [...current, workspaceId];
      }
      return current.filter((item) => item !== workspaceId);
    });
  };

  const continueToStepTwo = () => {
    const validation = validateStepOne();
    if (!validation.valid) {
      toast({
        title: "Fix validation errors",
        description: validation.firstError ?? "Please correct highlighted fields.",
        variant: "destructive",
      });
      return;
    }

    setEmail(validation.normalizedEmail);
    setPhone(validation.normalizedPhone);
    setStep(2);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateStepOne();
    if (!validation.valid || !validateStepTwo()) {
      toast({
        title: "Registration validation failed",
        description: "Please correct form errors and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedFullName = fullName.trim();
      const normalizedCountry = country.trim();
      const normalizedRegion = region.trim();

      const payload: RegisterAccountPayload =
        accountType === "sole"
          ? {
              accountType,
              fullName: normalizedFullName,
              email: validation.normalizedEmail,
              password,
              phone: validation.normalizedPhone,
              country: normalizedCountry,
              region: normalizedRegion,
              primaryCommodity: primaryCommodity.trim(),
              farmSizeAcres,
            }
          : {
              accountType,
              fullName: normalizedFullName,
              email: validation.normalizedEmail,
              password,
              phone: validation.normalizedPhone,
              country: normalizedCountry,
              region: normalizedRegion,
              organizationName: organizationName.trim(),
              organizationType,
              teamSize,
              enabledModules: enabledModules as WorkspaceId[],
            };

      await authService.register(payload);
      const session = await login(validation.normalizedEmail, password);

      const primaryWorkspace =
        accountType === "organization"
          ? ((enabledModules[0] as WorkspaceId | undefined) ?? "farmer")
          : "farmer";

      await securityService.saveOnboarding(session.user.id, {
        accountType,
        preferredLanguage: "English",
        region: normalizedRegion,
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
    } finally {
      setIsSubmitting(false);
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
                  <Input value={fullName} onChange={(event) => updateError("fullName", event.target.value)} required />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(event) => updateError("email", event.target.value)} required />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(event) => updateError("password", event.target.value)} required />
                  <p className="text-xs text-muted-foreground">Minimum 12 characters.</p>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => updateError("confirmPassword", event.target.value)}
                    required
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Phone (optional)</Label>
                  <Input
                    value={phone}
                    onChange={(event) => updateError("phone", event.target.value)}
                    placeholder="+256700000000"
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Input value={country} onChange={(event) => updateError("country", event.target.value)} required />
                  {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Region</Label>
                  <Input value={region} onChange={(event) => updateError("region", event.target.value)} required />
                  {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
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
                  <Button type="button" onClick={continueToStepTwo}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit" loading={isSubmitting}>
                    Register and Continue
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
