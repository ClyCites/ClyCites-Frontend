import type { EntityRecord, FieldDefinition } from "@/lib/store/types";

export type FormValues = Record<string, string | number | boolean>;

export function getPathValue(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

export function setPathValue(target: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = target;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;
    if (isLast) {
      current[key] = value;
      return;
    }

    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  });
}

export function parseValue(field: FieldDefinition, rawValue: string | number | boolean): unknown {
  if (field.type === "number") {
    const value = Number(rawValue);
    return Number.isNaN(value) ? 0 : value;
  }
  if (field.type === "switch") {
    return Boolean(rawValue);
  }
  if (field.type === "tags") {
    return String(rawValue)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return rawValue;
}

export function createEmptyFormValues(fields: FieldDefinition[]): FormValues {
  const baseValues: FormValues = {
    title: "",
    subtitle: "",
    tags: "",
  };

  fields.forEach((field) => {
    if (field.key in baseValues) {
      return;
    }

    if (field.type === "switch") {
      baseValues[field.key] = false;
      return;
    }

    baseValues[field.key] = "";
  });

  return baseValues;
}

export function toFormValues(record: EntityRecord, fields: FieldDefinition[]): FormValues {
  const values: FormValues = createEmptyFormValues(fields);

  values.title = record.title;
  values.subtitle = record.subtitle ?? "";
  values.tags = record.tags.join(", ");

  fields.forEach((field) => {
    const fieldValue = getPathValue(record as unknown as Record<string, unknown>, field.key);
    if (fieldValue === undefined || fieldValue === null) {
      return;
    }

    if (Array.isArray(fieldValue)) {
      values[field.key] = fieldValue.join(", ");
      return;
    }

    values[field.key] = fieldValue as string | number | boolean;
  });

  return values;
}

export function buildDataPayload(fields: FieldDefinition[], formValues: FormValues): Record<string, unknown> {
  const payloadData: Record<string, unknown> = {};
  fields
    .filter((field) => field.key.startsWith("data."))
    .forEach((field) => {
      const raw = formValues[field.key] ?? "";
      setPathValue(payloadData, field.key.replace(/^data\./, ""), parseValue(field, raw));
    });

  return payloadData;
}
