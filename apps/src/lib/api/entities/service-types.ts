import type { EntityKey, EntityRecord, ListParams, ListResult } from "@/lib/store/types";

export interface EntityCreatePayload {
  actorId: string;
  title: string;
  subtitle?: string;
  status?: string;
  tags?: string[];
  data: Record<string, unknown>;
}

export interface EntityUpdatePayload {
  actorId: string;
  title?: string;
  subtitle?: string;
  tags?: string[];
  data?: Record<string, unknown>;
}

export interface EntityService<K extends EntityKey> {
  listX: (params: ListParams) => Promise<ListResult<EntityRecord<K>>>;
  getX: (id: string) => Promise<EntityRecord<K>>;
  createX: (payload: EntityCreatePayload) => Promise<EntityRecord<K>>;
  updateX: (id: string, payload: EntityUpdatePayload) => Promise<EntityRecord<K>>;
  deleteX: (id: string, actorId: string) => Promise<void>;
  changeStatus: (id: string, actorId: string, status: string, note?: string) => Promise<EntityRecord<K>>;
  runAction: (actionId: string, actorId: string, targetId?: string) => Promise<{ message: string }>;
}
