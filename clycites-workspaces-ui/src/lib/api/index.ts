import { getApiMode } from "@/lib/api/config";
import type {
  AuthServiceContract,
  ChartServiceContract,
  SecurityServiceContract,
} from "@/lib/api/contracts";
import {
  auditService as mockAuditService,
  authService as mockAuthService,
  entityServices as mockEntityServices,
  notificationsService as mockNotificationsService,
  searchService as mockSearchService,
  securityService as mockSecurityService,
  chartService as mockChartService,
} from "@/lib/api/mock";
import {
  auditService as realAuditService,
  authService as realAuthService,
  entityServices as realEntityServices,
  notificationsService as realNotificationsService,
  searchService as realSearchService,
  securityService as realSecurityService,
  chartService as realChartService,
} from "@/lib/api/real";

export const apiMode = getApiMode();
export const isRealApiMode = apiMode === "real";

export const authService: AuthServiceContract = isRealApiMode ? realAuthService : mockAuthService;
export const securityService: SecurityServiceContract = isRealApiMode ? realSecurityService : mockSecurityService;
export const chartService: ChartServiceContract = isRealApiMode ? realChartService : mockChartService;
export const entityServices = isRealApiMode ? realEntityServices : mockEntityServices;
export const notificationsService = isRealApiMode ? realNotificationsService : mockNotificationsService;
export const auditService = isRealApiMode ? realAuditService : mockAuditService;
export const searchService = isRealApiMode ? realSearchService : mockSearchService;
