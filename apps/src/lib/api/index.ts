import type {
  AuthServiceContract,
  ChartServiceContract,
  SecurityServiceContract,
} from "@/lib/api/contracts";
import {
  auditService as realAuditService,
  authService as realAuthService,
  entityServices as realEntityServices,
  notificationsService as realNotificationsService,
  searchService as realSearchService,
  securityService as realSecurityService,
  chartService as realChartService,
} from "@/lib/api/real";
import { farmersApi } from "@/lib/api/farmers.api";
import { productsApi } from "@/lib/api/products.api";
import { ordersApi } from "@/lib/api/orders.api";

export const apiMode = "real";
export const isRealApiMode = true;

export const authService: AuthServiceContract = realAuthService;
export const securityService: SecurityServiceContract = realSecurityService;
export const chartService: ChartServiceContract = realChartService;
export const entityServices = realEntityServices;
export const notificationsService = realNotificationsService;
export const auditService = realAuditService;
export const searchService = realSearchService;
export { farmersApi, productsApi, ordersApi };
