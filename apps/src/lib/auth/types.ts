import type { WorkspaceId } from "@/lib/store/types";

export type RegistrationAccountType = "sole" | "organization";

interface RegistrationBase {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  region: string;
}

export interface RegisterSolePayload extends RegistrationBase {
  accountType: "sole";
  primaryCommodity: string;
  farmSizeAcres: number;
}

export interface RegisterOrganizationPayload extends RegistrationBase {
  accountType: "organization";
  organizationName: string;
  organizationType: "cooperative" | "agribusiness" | "ngo" | "government" | "exporter";
  teamSize: number;
  enabledModules: WorkspaceId[];
}

export type RegisterAccountPayload = RegisterSolePayload | RegisterOrganizationPayload;

export interface RegistrationResult {
  userId: string;
  accountType: RegistrationAccountType;
  email: string;
}

export type OtpPurpose = "login" | "verification" | "password_reset";

export interface AuthProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  profile?: Record<string, unknown>;
}

export interface OnboardingProfile {
  userId: string;
  accountType: RegistrationAccountType;
  preferredLanguage: string;
  region: string;
  primaryWorkspace: WorkspaceId;
  goals: string[];
  notificationChannels: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  completedAt: string;
}

export type MfaMethod = "authenticator" | "sms" | "email";

export interface UserSecuritySettings {
  userId: string;
  mfaEnabled: boolean;
  mfaMethod: MfaMethod;
  passkeyEnabled: boolean;
  loginAlerts: boolean;
  trustedDevicesOnly: boolean;
  backupCodes: string[];
  updatedAt: string;
}

export interface SecuritySession {
  id: string;
  userId: string;
  device: string;
  location: string;
  ipAddress: string;
  lastSeenAt: string;
  createdAt: string;
  current: boolean;
  trusted: boolean;
}

export interface SecurityState {
  version: number;
  onboarding: Record<string, OnboardingProfile>;
  settings: Record<string, UserSecuritySettings>;
  sessions: Record<string, SecuritySession[]>;
}
