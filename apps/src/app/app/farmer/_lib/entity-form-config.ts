import type { EntityRecord, FieldOption, FieldType } from "@/lib/store/types";
import type { FarmerEntityKey } from "@/app/app/farmer/_lib/entity-config";

export type FarmerFormValue = string | number | boolean;
export type FarmerFormValues = Record<string, FarmerFormValue>;

export interface FarmerEntityFormFieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  span?: 1 | 2;
  modes?: Array<"create" | "edit">;
  sourcePaths?: string[];
  defaultValue?: FarmerFormValue;
}

export interface FarmerEntityFormSection {
  title: string;
  description?: string;
  fields: FarmerEntityFormFieldDefinition[];
}

interface FarmerEntityMutationPayload {
  title: string;
  subtitle?: string;
  tags?: string[];
  data: Record<string, unknown>;
}

interface FarmerEntityFormDefinition {
  sections: FarmerEntityFormSection[];
  fields: FarmerEntityFormFieldDefinition[];
  buildPayload: (values: FarmerFormValues) => FarmerEntityMutationPayload;
}

const SIZE_UNIT_OPTIONS: FieldOption[] = [
  { label: "Acres", value: "acres" },
  { label: "Hectares", value: "hectares" },
  { label: "Square meters", value: "square_meters" },
];

const OWNERSHIP_OPTIONS: FieldOption[] = [
  { label: "Owned", value: "owned" },
  { label: "Leased", value: "leased" },
  { label: "Shared", value: "shared" },
  { label: "Contract", value: "contract" },
];

const PLOT_STATUS_OPTIONS: FieldOption[] = [
  { label: "Active", value: "active" },
  { label: "Fallow", value: "fallow" },
  { label: "Inactive", value: "inactive" },
];

const CROP_CATEGORY_OPTIONS: FieldOption[] = [
  { label: "Cereals", value: "cereals" },
  { label: "Legumes", value: "legumes" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Oilseeds", value: "oilseeds" },
  { label: "Roots & tubers", value: "roots_tubers" },
  { label: "Fodder", value: "fodder" },
  { label: "Other", value: "other" },
];

const SEASON_OPTIONS: FieldOption[] = [
  { label: "Season A", value: "season_a" },
  { label: "Season B", value: "season_b" },
  { label: "Dry season", value: "dry_season" },
  { label: "Wet season", value: "wet_season" },
  { label: "Year round", value: "year_round" },
];

const YIELD_UNIT_OPTIONS: FieldOption[] = [
  { label: "Kilograms", value: "kg" },
  { label: "Tons", value: "tons" },
  { label: "Bags", value: "bags" },
  { label: "Bunches", value: "bunches" },
  { label: "Pieces", value: "pieces" },
];

const CROP_STATUS_OPTIONS: FieldOption[] = [
  { label: "Planned", value: "planned" },
  { label: "In progress", value: "in_progress" },
  { label: "Harvested", value: "harvested" },
  { label: "Sold", value: "sold" },
  { label: "Stored", value: "stored" },
  { label: "Failed", value: "failed" },
];

const INPUT_TYPE_OPTIONS: FieldOption[] = [
  { label: "Seed", value: "seed" },
  { label: "Fertilizer", value: "fertilizer" },
  { label: "Pesticide", value: "pesticide" },
  { label: "Herbicide", value: "herbicide" },
  { label: "Equipment", value: "equipment" },
  { label: "Veterinary", value: "veterinary" },
  { label: "Other", value: "other" },
];

const INPUT_STATUS_OPTIONS: FieldOption[] = [
  { label: "Planned", value: "planned" },
  { label: "Applied", value: "applied" },
  { label: "Consumed", value: "consumed" },
  { label: "Cancelled", value: "cancelled" },
];

const TASK_CATEGORY_OPTIONS: FieldOption[] = [
  { label: "General", value: "general" },
  { label: "Pest & disease", value: "pest_disease" },
  { label: "Weather", value: "weather" },
  { label: "Market", value: "market" },
  { label: "Finance", value: "finance" },
];

const TASK_URGENCY_OPTIONS: FieldOption[] = [
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const ADVISORY_CATEGORY_OPTIONS: FieldOption[] = [
  { label: "Best practice", value: "best_practice" },
  { label: "Weather", value: "weather" },
  { label: "Pest outbreak", value: "pest_outbreak" },
  { label: "Market", value: "market" },
  { label: "Regulatory", value: "regulatory" },
];

const ADVISORY_URGENCY_OPTIONS: FieldOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
  { label: "Emergency", value: "emergency" },
];

const ALERT_SEVERITY_OPTIONS: FieldOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

const PRICE_SIGNAL_OPTIONS: FieldOption[] = [
  { label: "Price change", value: "price_change" },
  { label: "Price spike", value: "price_spike" },
  { label: "Price drop", value: "price_drop" },
  { label: "Supply shortage", value: "supply_shortage" },
  { label: "Demand surge", value: "demand_surge" },
];

function field(
  key: string,
  label: string,
  type: FieldType,
  sourcePaths: string[],
  options?: Partial<Omit<FarmerEntityFormFieldDefinition, "key" | "label" | "type" | "sourcePaths">>
): FarmerEntityFormFieldDefinition {
  return {
    key,
    label,
    type,
    sourcePaths,
    ...options,
  };
}

function buildDefinition(
  sections: FarmerEntityFormSection[],
  buildPayload: (values: FarmerFormValues) => FarmerEntityMutationPayload
): FarmerEntityFormDefinition {
  return {
    sections,
    fields: sections.flatMap((section) => section.fields),
    buildPayload,
  };
}

function getPathValue(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function cleanValue(value: unknown): unknown {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (Array.isArray(value)) {
    const cleaned = value.map((item) => cleanValue(item)).filter((item) => item !== undefined);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, entryValue]) => [key, cleanValue(entryValue)] as const)
      .filter(([, entryValue]) => entryValue !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  return value;
}

function cleanObject(value: Record<string, unknown>): Record<string, unknown> {
  return (cleanValue(value) as Record<string, unknown> | undefined) ?? {};
}

function toOptionalString(value: FarmerFormValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toRequiredString(value: FarmerFormValue | undefined, fallback: string): string {
  return toOptionalString(value) ?? fallback;
}

function toOptionalNumber(value: FarmerFormValue | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string" && value.trim().length === 0) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toBoolean(value: FarmerFormValue | undefined): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "yes" || normalized === "1") return true;
    if (normalized === "false" || normalized === "no" || normalized === "0") return false;
    if (["active", "open", "new", "acknowledged", "investigating", "investigated", "published", "verified"].includes(normalized)) {
      return true;
    }
    if (["closed", "dismissed", "inactive", "disabled", "resolved", "rejected", "cancelled"].includes(normalized)) {
      return false;
    }
  }
  return undefined;
}

function toStringArray(value: FarmerFormValue | undefined): string[] {
  if (value === undefined) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readFieldValue(record: EntityRecord, fieldDefinition: FarmerEntityFormFieldDefinition): FarmerFormValue {
  const defaultValue = fieldDefinition.defaultValue ?? (fieldDefinition.type === "switch" ? false : "");

  for (const path of fieldDefinition.sourcePaths ?? []) {
    const candidate = getPathValue(record as unknown as Record<string, unknown>, path);
    if (candidate === undefined || candidate === null) continue;

    if (fieldDefinition.type === "switch") {
      const boolValue = toBoolean(candidate as FarmerFormValue);
      if (boolValue !== undefined) return boolValue;
      continue;
    }

    if (Array.isArray(candidate)) return candidate.map((item) => String(item)).join(", ");
    if (typeof candidate === "object") continue;

    if (fieldDefinition.type === "number") {
      const numeric = Number(candidate);
      if (Number.isFinite(numeric)) return numeric;
    }

    return String(candidate);
  }

  return defaultValue;
}

function formatDateValue(value: unknown): string {
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString();
}

const FARMER_ENTITY_FORM_DEFINITIONS: Record<FarmerEntityKey, FarmerEntityFormDefinition> = {
  farmers: buildDefinition(
    [
      {
        title: "Profile",
        description: "Farmer profile fields that map to the profile API payload.",
        fields: [
          field("businessName", "Business Name", "text", ["title", "data.businessName", "data.name"], {
            placeholder: "Green Valley Growers",
          }),
          field("description", "Description", "textarea", ["subtitle", "data.description"], {
            span: 2,
            placeholder: "Short summary of the farmer profile",
          }),
        ],
      },
      {
        title: "Location",
        description: "Use the location structure expected by the farmer profile endpoints.",
        fields: [
          field("region", "Region", "text", ["data.location.region", "data.region"], {
            placeholder: "Central",
          }),
          field("district", "District", "text", ["data.location.district", "data.district"], {
            placeholder: "Mukono",
          }),
          field("village", "Village", "text", ["data.location.village", "data.village"], {
            placeholder: "Ntenjeru",
          }),
          field("latitude", "Latitude", "number", ["data.location.coordinates.lat", "data.lat", "data.latitude"]),
          field("longitude", "Longitude", "number", ["data.location.coordinates.lng", "data.lng", "data.longitude"]),
        ],
      },
      {
        title: "Production",
        description: "Operational fields used when creating and updating farmer profiles.",
        fields: [
          field("farmSize", "Farm Size", "number", ["data.farmSize", "data.farmSizeAcres"]),
          field("cropTypes", "Crop Types", "tags", ["data.cropTypes"], {
            span: 2,
            placeholder: "maize, beans, coffee",
          }),
        ],
      },
    ],
    (values) => {
      const lat = toOptionalNumber(values.latitude);
      const lng = toOptionalNumber(values.longitude);

      return {
        title: toRequiredString(values.businessName, "Untitled Farmer"),
        subtitle: toOptionalString(values.description),
        data: cleanObject({
          location: {
            region: toOptionalString(values.region),
            district: toOptionalString(values.district),
            village: toOptionalString(values.village),
            coordinates:
              lat !== undefined || lng !== undefined
                ? {
                    lat,
                    lng,
                  }
                : undefined,
          },
          region: toOptionalString(values.region),
          district: toOptionalString(values.district),
          village: toOptionalString(values.village),
          lat,
          lng,
          farmSize: toOptionalNumber(values.farmSize),
          cropTypes: toStringArray(values.cropTypes),
        }),
      };
    }
  ),
  farms: buildDefinition(
    [
      {
        title: "Farm Details",
        description: "Fields aligned to the farm create and update endpoints.",
        fields: [
          field("farmName", "Farm Name", "text", ["title", "data.farmName", "data.name"], {
            placeholder: "Kampala Demonstration Farm",
          }),
          field("notes", "Notes", "textarea", ["subtitle", "data.notes"], {
            span: 2,
            placeholder: "Operational notes for this farm",
          }),
        ],
      },
      {
        title: "Ownership",
        fields: [
          field("totalSize", "Total Size", "number", ["data.totalSize", "data.sizeInHectares", "data.areaAcres"]),
          field("sizeUnit", "Size Unit", "select", ["data.sizeUnit"], {
            options: SIZE_UNIT_OPTIONS,
            defaultValue: "acres",
            modes: ["create"],
          }),
          field("ownershipType", "Ownership Type", "select", ["data.ownershipType"], {
            options: OWNERSHIP_OPTIONS,
            defaultValue: "owned",
          }),
        ],
      },
      {
        title: "Location",
        fields: [
          field("region", "Region", "text", ["data.region", "data.location.region"], {
            placeholder: "Central",
            modes: ["create"],
          }),
          field("district", "District", "text", ["data.district", "data.location.district"], {
            placeholder: "Mukono",
            modes: ["create"],
          }),
          field("village", "Village", "text", ["data.village", "data.location.village"], {
            placeholder: "Ntenjeru",
            modes: ["create"],
          }),
        ],
      },
    ],
    (values) => ({
      title: toRequiredString(values.farmName, "Untitled Farm"),
      subtitle: toOptionalString(values.notes),
      data: cleanObject({
        totalSize: toOptionalNumber(values.totalSize),
        sizeUnit: toOptionalString(values.sizeUnit),
        ownershipType: toOptionalString(values.ownershipType),
        region: toOptionalString(values.region),
        district: toOptionalString(values.district),
        village: toOptionalString(values.village),
      }),
    })
  ),
  plots: buildDefinition(
    [
      {
        title: "Plot Details",
        description: "Plot payload fields are captured directly instead of the shared generic structure.",
        fields: [
          field("plotName", "Plot Name", "text", ["title", "data.plotName", "data.name"], {
            placeholder: "North block plot 01",
          }),
          field("notes", "Notes", "textarea", ["subtitle", "data.notes"], {
            span: 2,
            placeholder: "Anything important about this plot",
          }),
        ],
      },
      {
        title: "Placement",
        fields: [
          field("farmId", "Farm ID", "text", ["data.farmId"], {
            placeholder: "farm_123",
          }),
          field("area", "Area", "number", ["data.area", "data.areaAcres", "data.sizeInHectares"]),
          field("areaUnit", "Area Unit", "select", ["data.areaUnit"], {
            options: SIZE_UNIT_OPTIONS,
            defaultValue: "acres",
          }),
          field("status", "Plot Status", "select", ["data.status", "status"], {
            options: PLOT_STATUS_OPTIONS,
            defaultValue: "active",
          }),
        ],
      },
    ],
    (values) => ({
      title: toRequiredString(values.plotName, "Untitled Plot"),
      subtitle: toOptionalString(values.notes),
      data: cleanObject({
        farmId: toOptionalString(values.farmId),
        area: toOptionalNumber(values.area),
        areaUnit: toOptionalString(values.areaUnit),
        status: toOptionalString(values.status),
      }),
    })
  ),
  crops: buildDefinition(
    [
      {
        title: "Crop Identity",
        description: "These fields reflect the production endpoints used by the farmer workspace.",
        fields: [
          field("cropName", "Crop Name", "text", ["title", "data.cropName", "data.cropType"], {
            placeholder: "Maize",
          }),
          field("cropCategory", "Crop Category", "select", ["data.cropCategory", "data.category"], {
            options: CROP_CATEGORY_OPTIONS,
            defaultValue: "other",
          }),
        ],
      },
      {
        title: "Planning",
        fields: [
          field("farmId", "Farm ID", "text", ["data.farmId"], {
            placeholder: "farm_123",
          }),
          field("plotId", "Plot ID", "text", ["data.plotId"], {
            placeholder: "plot_123",
          }),
          field("season", "Season", "select", ["data.season", "data.stage"], {
            options: SEASON_OPTIONS,
            defaultValue: "season_a",
          }),
          field("year", "Year", "number", ["data.year"]),
        ],
      },
      {
        title: "Production Targets",
        fields: [
          field("areaPlanted", "Area Planted", "number", ["data.areaPlanted", "data.areaAcres", "data.sizeInHectares"]),
          field("areaUnit", "Area Unit", "select", ["data.areaUnit"], {
            options: SIZE_UNIT_OPTIONS,
            defaultValue: "acres",
          }),
          field("estimatedYield", "Estimated Yield", "number", ["data.estimatedYield", "data.expectedYield"]),
          field("yieldUnit", "Yield Unit", "select", ["data.yieldUnit", "data.unit"], {
            options: YIELD_UNIT_OPTIONS,
            defaultValue: "kg",
          }),
          field("productionStatus", "Production Status", "select", ["data.productionStatus", "data.status", "status"], {
            options: CROP_STATUS_OPTIONS,
            defaultValue: "planned",
          }),
          field("actualYield", "Actual Yield", "number", ["data.actualYield", "data.quantityHarvested", "data.predictedYield"]),
          field("notes", "Notes", "textarea", ["subtitle", "data.notes"], {
            span: 2,
            placeholder: "Field observations or production notes",
          }),
        ],
      },
    ],
    (values) => ({
      title: toRequiredString(values.cropName, "Untitled Crop"),
      subtitle: toOptionalString(values.notes),
      data: cleanObject({
        farmId: toOptionalString(values.farmId),
        plotId: toOptionalString(values.plotId),
        cropName: toOptionalString(values.cropName),
        cropCategory: toOptionalString(values.cropCategory),
        season: toOptionalString(values.season),
        year: toOptionalNumber(values.year),
        areaPlanted: toOptionalNumber(values.areaPlanted),
        areaUnit: toOptionalString(values.areaUnit),
        estimatedYield: toOptionalNumber(values.estimatedYield),
        yieldUnit: toOptionalString(values.yieldUnit),
        productionStatus: toOptionalString(values.productionStatus),
        actualYield: toOptionalNumber(values.actualYield),
        notes: toOptionalString(values.notes),
      }),
    })
  ),
  inputs: buildDefinition(
    [
      {
        title: "Input Details",
        description: "Inventory-style input fields are captured explicitly for the farmer input APIs.",
        fields: [
          field("inputName", "Input Name", "text", ["title", "data.inputName", "data.name"], {
            placeholder: "NPK Fertilizer",
          }),
          field("inputType", "Input Type", "select", ["data.inputType", "data.category"], {
            options: INPUT_TYPE_OPTIONS,
            defaultValue: "other",
          }),
        ],
      },
      {
        title: "Linkage",
        fields: [
          field("farmId", "Farm ID", "text", ["data.farmId"]),
          field("plotId", "Plot ID", "text", ["data.plotId"]),
        ],
      },
      {
        title: "Stock",
        fields: [
          field("quantity", "Quantity", "number", ["data.quantity", "data.stock"]),
          field("unit", "Unit", "text", ["data.unit"], {
            placeholder: "kg",
          }),
          field("status", "Input Status", "select", ["data.status", "status"], {
            options: INPUT_STATUS_OPTIONS,
            defaultValue: "planned",
          }),
          field("notes", "Notes", "textarea", ["subtitle", "data.notes"], {
            span: 2,
            placeholder: "Usage or sourcing notes",
          }),
        ],
      },
    ],
    (values) => ({
      title: toRequiredString(values.inputName, "Untitled Input"),
      subtitle: toOptionalString(values.notes),
      data: cleanObject({
        farmId: toOptionalString(values.farmId),
        plotId: toOptionalString(values.plotId),
        inputName: toOptionalString(values.inputName),
        inputType: toOptionalString(values.inputType),
        quantity: toOptionalNumber(values.quantity),
        unit: toOptionalString(values.unit),
        status: toOptionalString(values.status),
        notes: toOptionalString(values.notes),
      }),
    })
  ),
  tasks: buildDefinition(
    [
      {
        title: "Inquiry",
        description: "Farmer tasks in this workspace map to expert inquiry fields, not the old generic task metadata.",
        fields: [
          field("title", "Title", "text", ["title"], {
            placeholder: "Need support with leaf spot on maize",
          }),
          field("description", "Description", "textarea", ["subtitle", "data.description", "data.notes"], {
            span: 2,
            placeholder: "Describe the issue the farmer is reporting",
          }),
        ],
      },
      {
        title: "Routing",
        fields: [
          field("category", "Category", "select", ["data.category"], {
            options: TASK_CATEGORY_OPTIONS,
            defaultValue: "general",
          }),
          field("urgency", "Urgency", "select", ["data.urgency"], {
            options: TASK_URGENCY_OPTIONS,
            defaultValue: "normal",
          }),
          field("cropType", "Crop Type", "text", ["data.cropType"], {
            placeholder: "maize",
          }),
          field("farmId", "Farm ID", "text", ["data.farmId"]),
        ],
      },
    ],
    (values) => ({
      title: toRequiredString(values.title, "Untitled Inquiry"),
      subtitle: toOptionalString(values.description),
      data: cleanObject({
        category: toOptionalString(values.category),
        urgency: toOptionalString(values.urgency),
        cropType: toOptionalString(values.cropType),
        farmId: toOptionalString(values.farmId),
      }),
    })
  ),
  advisories: buildDefinition(
    [
      {
        title: "Advisory Content",
        description: "These fields match the expert advisory payload the farmer workspace calls.",
        fields: [
          field("title", "Title", "text", ["title"], {
            placeholder: "Rainfall advisory for central region",
          }),
          field("content", "Content", "textarea", ["subtitle", "data.notes", "data.content", "data.message"], {
            span: 2,
            placeholder: "Write the advisory message shown to farmers",
          }),
        ],
      },
      {
        title: "Targeting",
        fields: [
          field("category", "Category", "select", ["data.category", "data.targetGroup"], {
            options: ADVISORY_CATEGORY_OPTIONS,
            defaultValue: "best_practice",
          }),
          field("regions", "Target Regions", "tags", ["data.region", "data.targetRegions"], {
            placeholder: "central, western",
          }),
          field("cropTypes", "Target Crops", "tags", ["data.cropTypes", "data.targetCrops"], {
            placeholder: "maize, beans",
          }),
          field("urgency", "Urgency", "select", ["data.urgency", "status"], {
            options: ADVISORY_URGENCY_OPTIONS,
            defaultValue: "medium",
          }),
        ],
      },
      {
        title: "Scheduling",
        fields: [
          field("scheduledAt", "Scheduled At", "date", ["data.scheduledAt"]),
          field("expiresAt", "Expires At", "date", ["data.expiresAt"]),
        ],
      },
    ],
    (values) => {
      const regions = toStringArray(values.regions);
      const cropTypes = toStringArray(values.cropTypes);

      return {
        title: toRequiredString(values.title, "Untitled Advisory"),
        subtitle: toOptionalString(values.content),
        data: cleanObject({
          category: toOptionalString(values.category),
          targetGroup: toOptionalString(values.category),
          region: regions,
          cropTypes,
          urgency: toOptionalString(values.urgency),
          scheduledAt: toOptionalString(values.scheduledAt),
          expiresAt: toOptionalString(values.expiresAt),
          notes: toOptionalString(values.content),
        }),
      };
    }
  ),
  weatherAlerts: buildDefinition(
    [
      {
        title: "Alert Details",
        description: "Weather alert fields are kept aligned with the alert payload shape for consistency.",
        fields: [
          field("location", "Location", "text", ["data.location"], {
            placeholder: "Mukono",
          }),
          field("severity", "Severity", "select", ["data.severity"], {
            options: ALERT_SEVERITY_OPTIONS,
            defaultValue: "medium",
          }),
          field("assignedTo", "Assigned To", "text", ["data.assignedTo"], {
            placeholder: "Regional officer",
          }),
        ],
      },
    ],
    (values) => ({
      title: `Weather Alert${toOptionalString(values.location) ? ` - ${toOptionalString(values.location)}` : ""}`,
      data: cleanObject({
        location: toOptionalString(values.location),
        severity: toOptionalString(values.severity),
        assignedTo: toOptionalString(values.assignedTo),
      }),
    })
  ),
  priceSignals: buildDefinition(
    [
      {
        title: "Signal Scope",
        description: "Price signal forms now use the market alert API fields instead of the shared generic inputs.",
        fields: [
          field("commodity", "Product", "text", ["title", "data.commodity", "data.product", "data.productName"], {
            placeholder: "maize",
            modes: ["create"],
          }),
          field("region", "Region", "text", ["data.region", "data.market"], {
            placeholder: "all",
            modes: ["create"],
          }),
          field("district", "District", "text", ["data.district"], {
            placeholder: "Mukono",
            modes: ["create"],
          }),
        ],
      },
      {
        title: "Conditions",
        fields: [
          field("signal", "Signal Type", "select", ["data.conditions.signal", "data.signal"], {
            options: PRICE_SIGNAL_OPTIONS,
            defaultValue: "price_change",
          }),
          field("threshold", "Threshold", "number", ["data.conditions.threshold", "data.threshold", "data.confidence"]),
          field("notificationChannels", "Notification Channels", "tags", ["data.notificationChannels"], {
            span: 2,
            placeholder: "in_app, sms",
          }),
          field("active", "Active", "switch", ["data.active", "status"], {
            defaultValue: true,
          }),
        ],
      },
    ],
    (values) => {
      const signal = toOptionalString(values.signal);
      const threshold = toOptionalNumber(values.threshold);
      const notificationChannels = toStringArray(values.notificationChannels);
      const active = toBoolean(values.active);

      return {
        title: toRequiredString(values.commodity, "Untitled Price Signal"),
        data: cleanObject({
          commodity: toOptionalString(values.commodity),
          region: toOptionalString(values.region),
          market: toOptionalString(values.region),
          district: toOptionalString(values.district),
          signal,
          threshold,
          notificationChannels,
          active,
          conditions:
            signal !== undefined || threshold !== undefined
              ? {
                  signal,
                  threshold,
                }
              : undefined,
        }),
      };
    }
  ),
};

export function getFarmerEntityFormDefinition(entityKey: FarmerEntityKey): FarmerEntityFormDefinition {
  return FARMER_ENTITY_FORM_DEFINITIONS[entityKey];
}

export function createFarmerEntityFormValues(entityKey: FarmerEntityKey, record?: EntityRecord): FarmerFormValues {
  const definition = getFarmerEntityFormDefinition(entityKey);
  const values = Object.fromEntries(
    definition.fields.map((fieldDefinition) => [
      fieldDefinition.key,
      fieldDefinition.defaultValue ?? (fieldDefinition.type === "switch" ? false : ""),
    ])
  ) as FarmerFormValues;

  if (!record) {
    return values;
  }

  definition.fields.forEach((fieldDefinition) => {
    values[fieldDefinition.key] = readFieldValue(record, fieldDefinition);
  });

  return values;
}

export function getFarmerEntityMutationPayload(
  entityKey: FarmerEntityKey,
  values: FarmerFormValues
): FarmerEntityMutationPayload {
  return getFarmerEntityFormDefinition(entityKey).buildPayload(values);
}

export function getFarmerEntityFieldValue(
  record: EntityRecord,
  fieldDefinition: FarmerEntityFormFieldDefinition
): unknown {
  for (const path of fieldDefinition.sourcePaths ?? []) {
    const candidate = getPathValue(record as unknown as Record<string, unknown>, path);
    if (candidate !== undefined && candidate !== null) {
      return candidate;
    }
  }

  return undefined;
}

export function formatFarmerEntityFieldValue(
  fieldDefinition: FarmerEntityFormFieldDefinition,
  value: unknown
): string {
  if (value === undefined || value === null || value === "") return "-";
  if (fieldDefinition.type === "switch") return Boolean(value) ? "Yes" : "No";
  if (fieldDefinition.type === "date") return formatDateValue(value);
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
