import { listAuditLogs } from "@/lib/store";
import type { AuditFilterParams } from "@/lib/store/types";

export const auditService = {
  list(params: AuditFilterParams) {
    return listAuditLogs(params);
  },
};
