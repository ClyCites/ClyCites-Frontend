import type { EntityCreatePayload, EntityService, EntityUpdatePayload } from "@/lib/api/entities/service-types";
import type { EntityKey, EntityRecord, ListParams, ListResult, WorkspaceId } from "@/lib/store/types";
import { entityServices } from "@/lib/api/real/entities";

type EntityCreateRequest = Omit<EntityCreatePayload, "actorId">;
type EntityUpdateRequest = Omit<EntityUpdatePayload, "actorId">;

export interface EntityResourceApi<
  K extends EntityKey,
  TCreateInput,
  TUpdateInput = Partial<TCreateInput>,
> {
  entityKey: K;
  workspaceId: WorkspaceId;
  list: (params: ListParams) => Promise<ListResult<EntityRecord<K>>>;
  get: (id: string) => Promise<EntityRecord<K>>;
  create: (actorId: string, input: TCreateInput) => Promise<EntityRecord<K>>;
  update: (id: string, actorId: string, input: TUpdateInput) => Promise<EntityRecord<K>>;
  remove: (id: string, actorId: string) => Promise<void>;
  changeStatus: (id: string, actorId: string, status: string, note?: string) => Promise<EntityRecord<K>>;
  runAction: (actionId: string, actorId: string, targetId?: string) => Promise<{ message: string }>;
}

export function createEntityResourceApi<
  K extends EntityKey,
  TCreateInput,
  TUpdateInput = Partial<TCreateInput>,
>(options: {
  entityKey: K;
  workspaceId: WorkspaceId;
  mapCreateInput: (input: TCreateInput) => EntityCreateRequest;
  mapUpdateInput: (input: TUpdateInput) => EntityUpdateRequest;
}): EntityResourceApi<K, TCreateInput, TUpdateInput> {
  const service = entityServices[options.entityKey] as EntityService<K>;

  return {
    entityKey: options.entityKey,
    workspaceId: options.workspaceId,
    list: (params) => service.listX(params),
    get: (id) => service.getX(id),
    create: (actorId, input) =>
      service.createX({
        actorId,
        ...options.mapCreateInput(input),
      }),
    update: (id, actorId, input) =>
      service.updateX(id, {
        actorId,
        ...options.mapUpdateInput(input),
      }),
    remove: (id, actorId) => service.deleteX(id, actorId),
    changeStatus: (id, actorId, status, note) => service.changeStatus(id, actorId, status, note),
    runAction: (actionId, actorId, targetId) => service.runAction(actionId, actorId, targetId),
  };
}
