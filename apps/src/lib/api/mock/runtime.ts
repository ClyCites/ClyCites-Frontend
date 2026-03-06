import { getRuntimeConfig, updateRuntimeConfig } from "@/lib/store";

export const runtimeService = {
  getConfig() {
    return getRuntimeConfig();
  },
  updateConfig(actorId: string, patch: Parameters<typeof updateRuntimeConfig>[1]) {
    return updateRuntimeConfig(actorId, patch);
  },
};
