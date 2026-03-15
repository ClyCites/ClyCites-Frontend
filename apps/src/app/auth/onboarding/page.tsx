"use client";

import { useEffect, useState, Suspense } from "react";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { securityService } from "@/lib/api";
import { useMockSession } from "@/lib/auth/mock-session";
import type { MfaMethod, RegistrationAccountType } from "@/lib/auth/types";
import { WORKSPACES } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

const GOALS = [
  "Improve production planning",
  "Track marketplace performance",
  "Enable advisory collaboration",
  "Monitor weather risk",
  "Improve logistics reliability",
  "Strengthen financial controls",
];

function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/app";
  const { session, isLoading, availableWorkspaces } = useMockSession();

  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<RegistrationAccountType>("sole");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [region, setRegion] = useState("");
  const [primaryWorkspace, setPrimaryWorkspace] = useState<WorkspaceId>("farmer");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([GOALS[0]]);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(true);

  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>("authenticator");
  const [passkeyEnabled, setPasskeyEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const workspaceOptions = WORKSPACES.filter((workspace) => availableWorkspaces.includes(workspace.id));
  const selectedPrimaryWorkspace =
    availableWorkspaces.includes(primaryWorkspace)
      ? primaryWorkspace
      : session?.activeWorkspace && availableWorkspaces.includes(session.activeWorkspace)
        ? session.activeWorkspace
        : workspaceOptions[0]?.id ?? "farmer";

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace(`/auth/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [isLoading, nextPath, router, session]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("No active session");

      await securityService.saveOnboarding(session.user.id, {
        accountType,
        preferredLanguage,
        region,
        primaryWorkspace: selectedPrimaryWorkspace,
        goals: selectedGoals,
        notificationChannels: {
          email: notifyEmail,
          sms: notifySms,
          inApp: notifyInApp,
        },
      });

      await securityService.updateSettings(session.user.id, {
        mfaEnabled,
        mfaMethod,
        passkeyEnabled,
        loginAlerts,
      });
    },
    onSuccess: () => {
      toast({ title: "Onboarding complete", variant: "success" });
      router.replace(nextPath);
    },
    onError: (error) => {
      toast({
        title: "Unable to save onboarding",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const progress = step === 1 ? 33 : step === 2 ? 67 : 100;

  const toggleGoal = (goal: string, checked: boolean) => {
    setSelectedGoals((current) => {
      if (checked) {
        return current.includes(goal) ? current : [...current, goal];
      }
      return current.filter((item) => item !== goal);
    });
  };

  if (!session) return null;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
      <Card className="w-full panel-surface">
        <CardHeader>
          <div className="mb-2">
            <Image src="/logo.png" alt="ClyCites" width={752} height={927} className="h-16 w-auto" priority />
          </div>
          <CardTitle>Complete Your Onboarding</CardTitle>
          <CardDescription>Configure profile context, workspace focus, and baseline security settings.</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-5">
          {step === 1 && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Account type</Label>
                <Select value={accountType} onValueChange={(value) => setAccountType(value as RegistrationAccountType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole">Sole Operator</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Preferred language</Label>
                <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Swahili">Swahili</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Operational region</Label>
                <Input value={region} onChange={(event) => setRegion(event.target.value)} placeholder="e.g. Central Uganda" />
              </div>
              <div className="space-y-1.5">
                <Label>Primary workspace</Label>
                <Select value={selectedPrimaryWorkspace} onValueChange={(value) => setPrimaryWorkspace(value as WorkspaceId)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaceOptions.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label>What outcomes matter most?</Label>
              <div className="grid gap-2 rounded-xl border border-border/60 bg-background/55 p-3 sm:grid-cols-2">
                {GOALS.map((goal) => {
                  const checked = selectedGoals.includes(goal);
                  return (
                    <label key={goal} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={checked} onCheckedChange={(value) => toggleGoal(goal, Boolean(value))} />
                      <span>{goal}</span>
                    </label>
                  );
                })}
              </div>

              <div className="grid gap-2 rounded-xl border border-border/60 bg-background/55 p-3 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={notifyEmail} onCheckedChange={(checked) => setNotifyEmail(Boolean(checked))} /> Email alerts
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={notifySms} onCheckedChange={(checked) => setNotifySms(Boolean(checked))} /> SMS alerts
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={notifyInApp} onCheckedChange={(checked) => setNotifyInApp(Boolean(checked))} /> In-app alerts
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>MFA method</Label>
                <Select value={mfaMethod} onValueChange={(value) => setMfaMethod(value as MfaMethod)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authenticator">Authenticator app</SelectItem>
                    <SelectItem value="sms">SMS OTP</SelectItem>
                    <SelectItem value="email">Email OTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 rounded-xl border border-border/60 bg-background/55 p-3">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={mfaEnabled} onCheckedChange={(checked) => setMfaEnabled(Boolean(checked))} /> Enable MFA
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={passkeyEnabled} onCheckedChange={(checked) => setPasskeyEnabled(Boolean(checked))} /> Enable passkeys
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={loginAlerts} onCheckedChange={(checked) => setLoginAlerts(Boolean(checked))} /> Send login alerts
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={() => setStep((current) => Math.min(3, current + 1))}>Continue</Button>
            ) : (
              <Button onClick={() => submitMutation.mutate()} loading={submitMutation.isPending}>
                Finish Onboarding
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OnboardingPageWithSuspense() {
  return (
    <Suspense fallback={<LoadingSkeletons />}>
      <OnboardingPage />
    </Suspense>
  );
}
