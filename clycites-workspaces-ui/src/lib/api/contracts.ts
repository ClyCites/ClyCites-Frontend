import type {
  OnboardingProfile,
  RegisterAccountPayload,
  RegistrationResult,
  SecuritySession,
  UserSecuritySettings,
} from "@/lib/auth/types";
import type { AuthSession, WorkspaceId } from "@/lib/store/types";

export interface MfaPolicy {
  requiresMfa: boolean;
  challengeHint: string;
}

export interface AuthServiceContract {
  login(email: string, password: string): Promise<AuthSession>;
  me(): Promise<AuthSession | null>;
  logout(actorId?: string): Promise<void>;
  switchWorkspace(workspace: WorkspaceId): Promise<AuthSession>;
  getCredentials(): Array<{ email: string; password: string; role: string }>;
  register(payload: RegisterAccountPayload): Promise<RegistrationResult>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(email: string, code: string, newPassword: string): Promise<void>;
  getMfaPolicy(email: string): MfaPolicy;
  verifyMfaCode(email: string, code: string): Promise<void>;
  hasToken(): boolean;
}

export interface SecurityServiceContract {
  getSettings(userId: string): Promise<UserSecuritySettings>;
  updateSettings(
    userId: string,
    patch: Partial<Omit<UserSecuritySettings, "userId" | "backupCodes" | "updatedAt">>
  ): Promise<UserSecuritySettings>;
  rotateBackupCodes(userId: string): Promise<UserSecuritySettings>;
  listSessions(userId: string): Promise<SecuritySession[]>;
  terminateSession(userId: string, sessionId: string): Promise<SecuritySession[]>;
  getOnboarding(userId: string): Promise<OnboardingProfile | null>;
  isOnboardingComplete(userId: string): Promise<boolean>;
  saveOnboarding(
    userId: string,
    payload: Omit<OnboardingProfile, "userId" | "completedAt">
  ): Promise<OnboardingProfile>;
  initializeForUser(userId: string, defaults?: Partial<UserSecuritySettings>): void;
}

export interface ChartDefinitionMetric {
  type: string;
  field?: string;
  alias?: string;
}

export interface ChartDefinitionDimension {
  type: string;
  field?: string;
  alias?: string;
}

export interface ChartDefinitionFilter {
  field: string;
  operator: string;
  value: unknown;
}

export interface ChartDefinition {
  datasetId: string;
  metrics: ChartDefinitionMetric[];
  dimensions?: ChartDefinitionDimension[];
  chartType: string;
  filters?: ChartDefinitionFilter[];
  vizOptions?: {
    limit?: number;
    showLegend?: boolean;
    title?: string;
    colorScheme?: string;
  };
}

export interface ChartPreviewResult {
  rows: Array<Record<string, unknown>>;
  raw?: unknown;
}

export interface SaveChartRequest {
  name: string;
  description?: string;
  definition: ChartDefinition;
  tags?: string[];
  shareScope?: "owner_only" | "org_members" | "specific_roles" | "specific_users" | "public";
}

export interface SavedChart {
  id: string;
  name: string;
  description?: string;
  definition: ChartDefinition;
  tags: string[];
  shareScope: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardChartPosition {
  col: number;
  row: number;
}

export interface DashboardChartSize {
  w: number;
  h: number;
}

export interface DashboardChartItem {
  chartId: string;
  chartName?: string;
  position: DashboardChartPosition;
  size: DashboardChartSize;
}

export interface SaveDashboardRequest {
  name: string;
  description?: string;
  tags?: string[];
  shareScope?: "owner_only" | "org_members" | "specific_roles" | "specific_users" | "public";
}

export interface DashboardSharingUpdateRequest {
  scope: "owner_only" | "org_members" | "specific_roles" | "specific_users" | "public";
  roles?: string[];
  userIds?: string[];
}

export interface SavedDashboard {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  shareScope: string;
  charts: DashboardChartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AttachChartToDashboardRequest {
  chartId: string;
  position?: DashboardChartPosition;
  size?: DashboardChartSize;
}

export interface GenerateReportRequest {
  dashboardId?: string;
  format?: "csv" | "json" | "pdf";
  filename?: string;
  filters?: Record<string, unknown>;
}

export interface ChartExportResult {
  downloadUrl: string;
  filename: string;
  format: "csv" | "json" | "pdf";
}

export interface ChartServiceContract {
  previewChart(definition: ChartDefinition): Promise<ChartPreviewResult>;
  exportPreview(
    definition: ChartDefinition,
    options?: { format?: "csv" | "json"; filename?: string }
  ): Promise<ChartExportResult>;
  saveChart(payload: SaveChartRequest): Promise<SavedChart>;
  updateChart(chartId: string, payload: Partial<SaveChartRequest>): Promise<SavedChart>;
  deleteChart(chartId: string): Promise<void>;
  listCharts(params?: { page?: number; limit?: number; dataset?: string; tags?: string }): Promise<SavedChart[]>;
  exportChart(chartId: string, options?: { format?: "csv" | "json"; filename?: string }): Promise<ChartExportResult>;
  listDashboards(params?: { page?: number; limit?: number }): Promise<SavedDashboard[]>;
  createDashboard(payload: SaveDashboardRequest): Promise<SavedDashboard>;
  deleteDashboard(dashboardId: string): Promise<void>;
  updateDashboardSharing(dashboardId: string, payload: DashboardSharingUpdateRequest): Promise<SavedDashboard>;
  attachChartToDashboard(dashboardId: string, payload: AttachChartToDashboardRequest): Promise<SavedDashboard>;
  removeChartFromDashboard(dashboardId: string, chartId: string): Promise<SavedDashboard>;
  reorderDashboardCharts(dashboardId: string, orderedChartIds: string[]): Promise<SavedDashboard>;
  generateReport(payload: GenerateReportRequest): Promise<ChartExportResult>;
}
