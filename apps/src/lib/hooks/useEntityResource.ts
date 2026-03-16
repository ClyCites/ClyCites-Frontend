"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invalidateEntityMutation } from "@/lib/query/invalidation";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/lib/store/auth.store";
import type { EntityKey, EntityRecord, ListParams } from "@/lib/store/types";
import type { EntityResourceApi } from "@/lib/api/create-entity-resource-api";

export function useEntityResource<
  K extends EntityKey,
  TCreateInput,
  TUpdateInput = Partial<TCreateInput>,
>(
  api: EntityResourceApi<K, TCreateInput, TUpdateInput>,
  options?: {
    listParams?: ListParams;
    recordId?: string;
    listEnabled?: boolean;
    recordEnabled?: boolean;
  }
) {
  const queryClient = useQueryClient();
  const actorId = useAuthStore((state) => state.session?.user.id ?? null);

  const listQuery = useQuery({
    queryKey: options?.listParams ? queryKeys.entity.list(api.workspaceId, api.entityKey, options.listParams) : [api.entityKey, "list", "idle"],
    queryFn: () => api.list(options?.listParams as ListParams),
    enabled: Boolean(options?.listParams) && (options?.listEnabled ?? true),
  });

  const recordQuery = useQuery<EntityRecord<K>>({
    queryKey: options?.recordId ? [...queryKeys.entity.scope(api.workspaceId, api.entityKey), "record", options.recordId] : [api.entityKey, "record", "idle"],
    queryFn: () => api.get(options?.recordId as string),
    enabled: Boolean(options?.recordId) && (options?.recordEnabled ?? true),
  });

  const createMutation = useMutation({
    mutationFn: async (input: TCreateInput) => {
      if (!actorId) throw new Error("No active session");
      return api.create(actorId, input);
    },
    onSuccess: async () => {
      await invalidateEntityMutation(queryClient, { entityKey: api.entityKey, workspaceId: api.workspaceId });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; input: TUpdateInput }) => {
      if (!actorId) throw new Error("No active session");
      return api.update(payload.id, actorId, payload.input);
    },
    onSuccess: async () => {
      await invalidateEntityMutation(queryClient, { entityKey: api.entityKey, workspaceId: api.workspaceId });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actorId) throw new Error("No active session");
      return api.remove(id, actorId);
    },
    onSuccess: async () => {
      await invalidateEntityMutation(queryClient, { entityKey: api.entityKey, workspaceId: api.workspaceId });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: string; note?: string }) => {
      if (!actorId) throw new Error("No active session");
      return api.changeStatus(payload.id, actorId, payload.status, payload.note);
    },
    onSuccess: async () => {
      await invalidateEntityMutation(queryClient, { entityKey: api.entityKey, workspaceId: api.workspaceId });
    },
  });

  const actionMutation = useMutation({
    mutationFn: async (payload: { actionId: string; targetId?: string }) => {
      if (!actorId) throw new Error("No active session");
      return api.runAction(payload.actionId, actorId, payload.targetId);
    },
    onSuccess: async () => {
      await invalidateEntityMutation(queryClient, { entityKey: api.entityKey, workspaceId: api.workspaceId });
    },
  });

  return {
    actorId,
    listQuery,
    recordQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    statusMutation,
    actionMutation,
  };
}
