export type WorkspaceId =
  | "farmer"
  | "production"
  | "aggregation"
  | "marketplace"
  | "logistics"
  | "finance"
  | "weather"
  | "prices"
  | "expert"
  | "analytics"
  | "admin";

export type PermissionAction = "read" | "write" | "delete" | "status";

export type EntityKey =
  | "farmers"
  | "farms"
  | "plots"
  | "crops"
  | "inputs"
  | "tasks"
  | "advisories"
  | "weatherAlerts"
  | "priceSignals"
  | "cropCycles"
  | "growthStages"
  | "sensorReadings"
  | "pestIncidents"
  | "yieldPredictions"
  | "warehouses"
  | "storageBins"
  | "batches"
  | "qualityGrades"
  | "stockMovements"
  | "spoilageReports"
  | "listings"
  | "rfqs"
  | "orders"
  | "contracts"
  | "negotiations"
  | "reviews"
  | "shipments"
  | "routes"
  | "vehicles"
  | "drivers"
  | "trackingEvents"
  | "coldChainLogs"
  | "wallets"
  | "transactions"
  | "escrowAccounts"
  | "payouts"
  | "invoices"
  | "credits"
  | "insurancePolicies"
  | "stations"
  | "forecasts"
  | "alertRules"
  | "commodities"
  | "marketPrices"
  | "priceEstimations"
  | "pricePredictions"
  | "recommendations"
  | "marketSignals"
  | "dataSources"
  | "knowledgeBaseArticles"
  | "researchReports"
  | "fieldCases"
  | "assignments"
  | "reviewQueue"
  | "datasets"
  | "charts"
  | "dashboards"
  | "reports"
  | "templates"
  | "users"
  | "orgs"
  | "roles"
  | "permissions"
  | "apiTokens"
  | "moduleToggles";

export type Permission =
  | `workspace.${WorkspaceId}.access`
  | `entity.${EntityKey}.${PermissionAction}`
  | "global.search"
  | "notifications.read"
  | "admin.audit.read"
  | "admin.config.write";

export type RoleId =
  | "farmer_agent"
  | "production_manager"
  | "inventory_manager"
  | "market_operator"
  | "logistics_coordinator"
  | "finance_officer"
  | "weather_analyst"
  | "price_analyst"
  | "expert_officer"
  | "analytics_lead"
  | "org_admin"
  | "super_admin";

export interface EntityBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  tags: string[];
}

export interface DateRange {
  from?: string;
  to?: string;
}

export interface EntityFilters {
  text?: string;
  status?: string[];
  tags?: string[];
  dateRange?: DateRange;
}

export interface SortRule {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ListParams {
  pagination: PaginationParams;
  sort?: SortRule;
  filters?: EntityFilters;
}

export interface ListResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface FarmerPayload {
  businessName: string;
  description?: string;
  location: {
    region: string;
    district: string;
    village?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  farmSize?: number;
  cropTypes?: string[];
  verified?: boolean;
}

export interface FarmPayload {
  location: string;
  lat?: number;
  lng?: number;
  plotIds: string[];
}

export interface PlotPayload {
  farmId: string;
  areaAcres: number;
  lat?: number;
  lng?: number;
  cropIds: string[];
}

export interface CropPayload {
  plotId: string;
  cropType: string;
  stage: string;
  plantingDate?: string;
  harvestDate?: string;
}

export interface InputPayload {
  cropId: string;
  category: string;
  stock: number;
  used: number;
}

export interface TaskPayload {
  assignedTo: string;
  reminderAt?: string;
  dueDate?: string;
}

export interface AdvisoryPayload {
  targetGroup: string;
  region: string;
  version: number;
  notes?: string;
}

export interface WeatherAlertPayload {
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  assignedTo?: string;
}

export interface PriceSignalPayload {
  commodity: string;
  market: string;
  signal: string;
  confidence: number;
}

export interface CropCyclePayload {
  plotId: string;
  plantingTarget: string;
  harvestTarget: string;
}

export interface GrowthStagePayload {
  cycleId: string;
  stage: string;
  observedAt: string;
}

export interface SensorReadingPayload {
  stationId: string;
  plotId: string;
  metric: string;
  value: number;
}

export interface PestIncidentPayload {
  cropId: string;
  severity: "low" | "medium" | "high";
  photoUrl?: string;
}

export interface YieldPredictionPayload {
  cropId: string;
  confidence: number;
  predictedYield: number;
  horizonDays: number;
}

export interface WarehousePayload {
  location: string;
  capacity: number;
}

export interface StorageBinPayload {
  warehouseId: string;
  capacity: number;
  temperatureControl: boolean;
}

export interface BatchPayload {
  commodity: string;
  quantity: number;
  grade: string;
  warehouseId: string;
  binId?: string;
}

export interface QualityGradePayload {
  batchId: string;
  grade: string;
  notes?: string;
}

export interface StockMovementPayload {
  batchId: string;
  movementType: "receive" | "transfer" | "dispatch";
  quantity: number;
  sourceId?: string;
  destinationId?: string;
}

export interface SpoilageReportPayload {
  batchId: string;
  quantity: number;
  cause: string;
}

export interface ListingPayload {
  commodity: string;
  unit: string;
  price: number;
  pricingMode: "fixed" | "negotiable" | "auction";
}

export interface RfqPayload {
  commodity: string;
  quantity: number;
  targetPrice: number;
  responseCount: number;
}

export interface OrderPayload {
  listingId: string;
  buyer: string;
  seller: string;
  quantity: number;
  amount: number;
}

export interface ContractPayload {
  partyA: string;
  partyB: string;
  milestones: string[];
  signed: boolean;
}

export interface NegotiationPayload {
  orderId: string;
  messageCount: number;
  lastMessage?: string;
}

export interface ReviewPayload {
  orderId: string;
  rating: number;
  reviewText: string;
}

export interface ShipmentPayload {
  orderId: string;
  routeId: string;
  vehicleId: string;
  driverId: string;
}

export interface RoutePayload {
  origin: string;
  destination: string;
  distanceKm: number;
}

export interface VehiclePayload {
  registration: string;
  capacityKg: number;
  coldChainEnabled: boolean;
  available: boolean;
}

export interface DriverPayload {
  phone: string;
  licenseNumber: string;
  available: boolean;
}

export interface TrackingEventPayload {
  shipmentId: string;
  location: string;
  note: string;
}

export interface ColdChainLogPayload {
  shipmentId: string;
  temperatureC: number;
  thresholdC: number;
  violation: boolean;
}

export interface WalletPayload {
  ownerId: string;
  balance: number;
  currency: string;
}

export interface TransactionPayload {
  walletId: string;
  transactionType: "credit" | "debit";
  amount: number;
  reference: string;
}

export interface EscrowPayload {
  orderId: string;
  amount: number;
  releaseCondition: string;
}

export interface PayoutPayload {
  beneficiaryId: string;
  amount: number;
  method: string;
}

export interface InvoicePayload {
  orderId: string;
  amount: number;
  dueDate?: string;
}

export interface CreditPayload {
  applicantId: string;
  requestedAmount: number;
  score: number;
}

export interface InsurancePolicyPayload {
  policyNumber: string;
  provider: string;
  coverageAmount: number;
  claimStatus?: string;
}

export interface StationPayload {
  location: string;
  lat?: number;
  lng?: number;
  stationStatus: "online" | "offline";
  lastReadingAt?: string;
}

export interface ForecastPayload {
  stationId?: string;
  location: string;
  horizonDays: number;
  summary: string;
}

export interface AlertRulePayload {
  condition: string;
  action: string;
  enabled: boolean;
}

export interface CommodityPayload {
  unit: string;
  grade: string;
}

export interface MarketPricePayload {
  commodityId: string;
  market: string;
  price: number;
  observedAt: string;
}

export interface PriceEstimationPayload {
  commodityId: string;
  market: string;
  estimatedPrice: number;
  assumptions: string;
}

export interface PricePredictionPayload {
  commodityId: string;
  horizonDays: number;
  confidence: number;
  series: number[];
}

export interface RecommendationPayload {
  commodityId: string;
  recommendationType: string;
  rationale: string;
}

export interface MarketSignalPayload {
  commodityId: string;
  anomalyScore: number;
  investigated: boolean;
  notes?: string;
}

export interface DataSourcePayload {
  provider: string;
  endpoint: string;
  enabled: boolean;
}

export interface KnowledgeBasePayload {
  category: string;
  tags: string[];
  body: string;
}

export interface ResearchReportPayload {
  summary: string;
  datasetRef?: string;
}

export interface FieldCasePayload {
  farmerId: string;
  assignedOfficer?: string;
  visitSchedule?: string;
  notes?: string;
}

export interface AssignmentPayload {
  assignee: string;
  dueDate?: string;
  relatedEntityId?: string;
}

export interface ReviewQueuePayload {
  relatedEntity: string;
  reviewer?: string;
  comments?: string;
}

export interface DatasetPayload {
  source: string;
  schemaVersion: string;
}

export interface ChartPayload {
  datasetId: string;
  metric: string;
  dimension: string;
  filters: string;
  shareScope: "private" | "org" | "public";
}

export interface DashboardPayload {
  chartIds: string[];
  layout: string;
}

export interface ReportPayload {
  dashboardId: string;
  format: "pdf" | "csv" | "doc";
}

export interface TemplatePayload {
  basedOnType: "chart" | "dashboard";
  basedOnId: string;
  shareScope: "private" | "org" | "public";
}

export interface UserPayload {
  name: string;
  email: string;
  orgId: string;
  roles: RoleId[];
}

export interface OrgPayload {
  name: string;
  enabledModules: WorkspaceId[];
}

export interface RolePayload {
  name: string;
  permissions: Permission[];
}

export interface PermissionPayload {
  code: Permission;
  description: string;
}

export interface ApiTokenPayload {
  name: string;
  scopes: string[];
  rateLimit: number;
  expiresAt?: string;
  revoked: boolean;
  tokenPreview?: string;
}

export interface ModuleTogglePayload {
  orgId: string;
  workspace: WorkspaceId;
  enabled: boolean;
}

export interface EntityPayloadMap {
  farmers: FarmerPayload;
  farms: FarmPayload;
  plots: PlotPayload;
  crops: CropPayload;
  inputs: InputPayload;
  tasks: TaskPayload;
  advisories: AdvisoryPayload;
  weatherAlerts: WeatherAlertPayload;
  priceSignals: PriceSignalPayload;
  cropCycles: CropCyclePayload;
  growthStages: GrowthStagePayload;
  sensorReadings: SensorReadingPayload;
  pestIncidents: PestIncidentPayload;
  yieldPredictions: YieldPredictionPayload;
  warehouses: WarehousePayload;
  storageBins: StorageBinPayload;
  batches: BatchPayload;
  qualityGrades: QualityGradePayload;
  stockMovements: StockMovementPayload;
  spoilageReports: SpoilageReportPayload;
  listings: ListingPayload;
  rfqs: RfqPayload;
  orders: OrderPayload;
  contracts: ContractPayload;
  negotiations: NegotiationPayload;
  reviews: ReviewPayload;
  shipments: ShipmentPayload;
  routes: RoutePayload;
  vehicles: VehiclePayload;
  drivers: DriverPayload;
  trackingEvents: TrackingEventPayload;
  coldChainLogs: ColdChainLogPayload;
  wallets: WalletPayload;
  transactions: TransactionPayload;
  escrowAccounts: EscrowPayload;
  payouts: PayoutPayload;
  invoices: InvoicePayload;
  credits: CreditPayload;
  insurancePolicies: InsurancePolicyPayload;
  stations: StationPayload;
  forecasts: ForecastPayload;
  alertRules: AlertRulePayload;
  commodities: CommodityPayload;
  marketPrices: MarketPricePayload;
  priceEstimations: PriceEstimationPayload;
  pricePredictions: PricePredictionPayload;
  recommendations: RecommendationPayload;
  marketSignals: MarketSignalPayload;
  dataSources: DataSourcePayload;
  knowledgeBaseArticles: KnowledgeBasePayload;
  researchReports: ResearchReportPayload;
  fieldCases: FieldCasePayload;
  assignments: AssignmentPayload;
  reviewQueue: ReviewQueuePayload;
  datasets: DatasetPayload;
  charts: ChartPayload;
  dashboards: DashboardPayload;
  reports: ReportPayload;
  templates: TemplatePayload;
  users: UserPayload;
  orgs: OrgPayload;
  roles: RolePayload;
  permissions: PermissionPayload;
  apiTokens: ApiTokenPayload;
  moduleToggles: ModuleTogglePayload;
}

export interface EntityRecord<K extends EntityKey = EntityKey> extends EntityBase {
  entity: K;
  workspace: WorkspaceId;
  title: string;
  subtitle?: string;
  status: string;
  data: Record<string, unknown>;
}

export type EntityCollectionMap = Record<EntityKey, EntityRecord[]>;

export interface RoleDefinition {
  id: RoleId;
  label: string;
  permissions: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  enabledModules: WorkspaceId[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  timezone?: string;
  language?: string;
  orgId: string;
  roles: RoleId[];
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  activeWorkspace: WorkspaceId;
  createdAt: string;
  expiresAt: string;
}

export type AuditAction = "create" | "update" | "delete" | "status_change" | "login" | "logout" | "simulate";

export interface AuditRecord extends EntityBase {
  actorId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  workspace?: WorkspaceId;
  summary: string;
  fromStatus?: string;
  toStatus?: string;
  metadata?: Record<string, unknown>;
}

export interface AppNotification extends EntityBase {
  title: string;
  message: string;
  read: boolean;
  severity: "info" | "success" | "warning" | "error";
  link?: string;
  workspace?: WorkspaceId;
  entityType?: string;
  entityId?: string;
}

export interface MockRuntimeConfig {
  latencyMs: number;
  jitterMs: number;
  errorRate: number;
  enableRandomErrors: boolean;
}

export interface DatabaseState {
  version: number;
  users: UserAccount[];
  organizations: Organization[];
  roles: RoleDefinition[];
  sessions: SessionRecord[];
  entities: EntityCollectionMap;
  auditLogs: AuditRecord[];
  notifications: AppNotification[];
  runtime: MockRuntimeConfig;
}

export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "switch" | "tags";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
  description?: string;
}

export interface EntityActionDefinition {
  id: string;
  label: string;
  description: string;
  targetStatus?: string;
}

export interface EntityDefinition<K extends EntityKey = EntityKey> {
  key: K;
  label: string;
  pluralLabel: string;
  defaultStatus: string;
  statuses: string[];
  fields: FieldDefinition[];
  defaultSort: SortRule;
  workflowActions?: EntityActionDefinition[];
  toolbarActions?: EntityActionDefinition[];
}

export interface WorkspaceDefinition {
  id: WorkspaceId;
  label: string;
  description: string;
  route: string;
  icon: string;
}

export interface SearchResultItem {
  id: string;
  entity: EntityKey;
  title: string;
  status: string;
  workspace: WorkspaceId;
  route: string;
  updatedAt: string;
}

export interface AuditFilterParams {
  actorId?: string;
  action?: AuditAction;
  entityType?: string;
  dateRange?: DateRange;
  text?: string;
  page: number;
  pageSize: number;
}

export interface NotificationFilterParams {
  workspace?: WorkspaceId;
  unreadOnly?: boolean;
  page: number;
  pageSize: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<UserAccount, "password">;
  organization: Organization;
}

export interface AuthSession {
  token: string;
  user: Omit<UserAccount, "password">;
  organization: Organization;
  activeWorkspace: WorkspaceId;
}

export interface ApiErrorShape {
  code: string;
  message: string;
}
