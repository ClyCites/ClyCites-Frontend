import type {
  EntityActionDefinition,
  EntityDefinition,
  EntityKey,
  FieldDefinition,
  Permission,
  RoleDefinition,
  RoleId,
  WorkspaceDefinition,
  WorkspaceId,
} from "@/lib/store/types";

export const WORKSPACES: WorkspaceDefinition[] = [
  {
    id: "farmer",
    label: "Farmer",
    description: "Farmer profile, plots, crops, tasks, and advisory inbox.",
    route: "/app/farmer",
    icon: "Sprout",
  },
  {
    id: "production",
    label: "Production",
    description: "Cycle planning, stages, incidents, sensors, and yield intelligence.",
    route: "/app/production",
    icon: "Factory",
  },
  {
    id: "aggregation",
    label: "Aggregation & Inventory",
    description: "Warehouse, bins, batches, quality grading, and stock movement control.",
    route: "/app/aggregation",
    icon: "Warehouse",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Listings, RFQs, orders, contracts, negotiation threads, and reviews.",
    route: "/app/marketplace",
    icon: "Store",
  },
  {
    id: "logistics",
    label: "Logistics",
    description: "Shipment planning, fleet assignment, tracking, and cold-chain logs.",
    route: "/app/logistics",
    icon: "Truck",
  },
  {
    id: "finance",
    label: "Finance",
    description: "Wallet, escrow, transactions, invoicing, credit, and insurance flows.",
    route: "/app/finance",
    icon: "Wallet",
  },
  {
    id: "weather",
    label: "Weather",
    description: "Stations, forecasts, alert rules, and simulation-driven alerting.",
    route: "/app/weather",
    icon: "CloudLightning",
  },
  {
    id: "prices",
    label: "Price Intelligence",
    description: "Commodity prices, estimations, predictions, recommendations, and signals.",
    route: "/app/prices",
    icon: "TrendingUp",
  },
  {
    id: "expert",
    label: "Expert Portal",
    description: "Advisory workflows, knowledge base, reports, and field support operations.",
    route: "/app/expert",
    icon: "GraduationCap",
  },
  {
    id: "analytics",
    label: "Analytics Studio",
    description: "Datasets, chart builder, dashboards, reports, and templates.",
    route: "/app/analytics",
    icon: "ChartNoAxesCombined",
  },
  {
    id: "admin",
    label: "Admin Control Center",
    description: "User/org governance, role permission controls, tokens, and audit visibility.",
    route: "/app/admin",
    icon: "ShieldCheck",
  },
];

export const WORKSPACE_ENTITY_MAP: Record<WorkspaceId, EntityKey[]> = {
  farmer: ["farmers", "farms", "plots", "crops", "inputs", "tasks", "advisories", "weatherAlerts", "priceSignals"],
  production: ["cropCycles", "growthStages", "sensorReadings", "pestIncidents", "yieldPredictions"],
  aggregation: ["warehouses", "storageBins", "batches", "qualityGrades", "stockMovements", "spoilageReports"],
  marketplace: ["listings", "rfqs", "orders", "contracts", "negotiations", "reviews"],
  logistics: ["shipments", "routes", "vehicles", "drivers", "trackingEvents", "coldChainLogs"],
  finance: ["wallets", "transactions", "escrowAccounts", "payouts", "invoices", "credits", "insurancePolicies"],
  weather: ["stations", "forecasts", "weatherAlerts", "alertRules"],
  prices: ["commodities", "marketPrices", "priceEstimations", "pricePredictions", "recommendations", "marketSignals", "dataSources"],
  expert: ["advisories", "knowledgeBaseArticles", "researchReports", "fieldCases", "assignments", "reviewQueue"],
  analytics: ["datasets", "charts", "dashboards", "reports", "templates"],
  admin: ["users", "orgs", "roles", "permissions", "apiTokens", "moduleToggles"],
};

const commonFields: FieldDefinition[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "subtitle", label: "Subtitle", type: "textarea" },
  { key: "tags", label: "Tags (comma-separated)", type: "tags" },
];

const dateField = (key: string, label: string): FieldDefinition => ({ key, label, type: "date" });
const numberField = (key: string, label: string): FieldDefinition => ({ key, label, type: "number" });
const textField = (key: string, label: string): FieldDefinition => ({ key, label, type: "text" });

const statusAction = (id: string, label: string, description: string, targetStatus: string): EntityActionDefinition => ({
  id,
  label,
  description,
  targetStatus,
});

function createEntityDefinition<K extends EntityKey>(
  key: K,
  label: string,
  pluralLabel: string,
  statuses: string[],
  fields: FieldDefinition[],
  workflowActions: EntityActionDefinition[] = [],
  toolbarActions: EntityActionDefinition[] = []
): EntityDefinition<K> {
  return {
    key,
    label,
    pluralLabel,
    defaultStatus: statuses[0],
    statuses,
    fields: [...commonFields, ...fields],
    defaultSort: { field: "updatedAt", direction: "desc" },
    workflowActions,
    toolbarActions,
  };
}

export const ENTITY_DEFINITIONS: Record<EntityKey, EntityDefinition> = {
  farmers: createEntityDefinition(
    "farmers",
    "Farmer",
    "Farmers",
    ["draft", "submitted", "verified", "rejected"],
    [
      textField("data.location.region", "Region"),
      textField("data.location.district", "District"),
      textField("data.location.village", "Village"),
      numberField("data.location.coordinates.lat", "Latitude"),
      numberField("data.location.coordinates.lng", "Longitude"),
      numberField("data.farmSize", "Farm Size (acres)"),
      textField("data.cropTypes", "Crop Types"),
    ],
    [
      {
        id: "submit-verification",
        label: "Submit for Verification",
        description: "Submit profile for verifier review.",
      },
      statusAction("verify-profile", "Verify", "Mark profile as verified.", "verified"),
      statusAction("reject-profile", "Reject", "Reject profile verification.", "rejected"),
    ]
  ),
  farms: createEntityDefinition("farms", "Farm", "Farms", ["active", "inactive"], [
    textField("data.location", "Location"),
    numberField("data.lat", "Latitude"),
    numberField("data.lng", "Longitude"),
    textField("data.plotIds", "Linked Plot IDs"),
  ]),
  plots: createEntityDefinition(
    "plots",
    "Plot",
    "Plots",
    ["active", "inactive"],
    [
      textField("data.farmId", "Farm ID"),
      numberField("data.areaAcres", "Area (acres)"),
      numberField("data.lat", "Latitude"),
      numberField("data.lng", "Longitude"),
      textField("data.cropIds", "Crop IDs"),
    ],
    [],
    [
      {
        id: "connect-sensor",
        label: "Connect Sensor",
        description: "Placeholder for IoT station integration flow.",
      },
    ]
  ),
  crops: createEntityDefinition("crops", "Crop", "Crops", ["planned", "growing", "harvested", "archived"], [
    textField("data.plotId", "Plot ID"),
    textField("data.cropType", "Crop Type"),
    textField("data.stage", "Growth Stage"),
    dateField("data.plantingDate", "Planting Date"),
    dateField("data.harvestDate", "Harvest Target"),
  ]),
  inputs: createEntityDefinition("inputs", "Input", "Inputs", ["in_stock", "low_stock", "out_of_stock"], [
    textField("data.cropId", "Crop ID"),
    textField("data.category", "Category"),
    numberField("data.stock", "Stock"),
    numberField("data.used", "Used"),
  ]),
  tasks: createEntityDefinition("tasks", "Task", "Tasks", ["todo", "doing", "done"], [
    textField("data.assignedTo", "Assigned To"),
    dateField("data.reminderAt", "Reminder"),
    dateField("data.dueDate", "Due Date"),
  ]),
  advisories: createEntityDefinition(
    "advisories",
    "Advisory",
    "Advisories",
    ["draft", "in_review", "approved", "published", "rejected", "acknowledged"],
    [
      textField("data.targetGroup", "Target Group"),
      textField("data.region", "Region"),
      numberField("data.version", "Version"),
      textField("data.notes", "Notes"),
    ],
    [
      statusAction("submit-review", "Submit for Review", "Move draft to review queue.", "in_review"),
      statusAction("approve", "Approve", "Approve advisory content.", "approved"),
      statusAction("reject", "Reject", "Reject advisory with comments.", "rejected"),
      statusAction("publish", "Publish", "Publish advisory to farmer groups.", "published"),
      statusAction("acknowledge", "Acknowledge", "Acknowledge advisory receipt.", "acknowledged"),
    ]
  ),
  weatherAlerts: createEntityDefinition(
    "weatherAlerts",
    "Weather Alert",
    "Weather Alerts",
    ["new", "acknowledged", "escalated", "resolved"],
    [
      textField("data.location", "Location"),
      {
        key: "data.severity",
        label: "Severity",
        type: "select",
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
          { label: "Critical", value: "critical" },
        ],
      },
      textField("data.assignedTo", "Assigned To"),
    ],
    [
      statusAction("acknowledge", "Acknowledge", "Mark alert acknowledged.", "acknowledged"),
      statusAction("escalate", "Escalate", "Escalate alert to response team.", "escalated"),
      statusAction("resolve", "Resolve", "Close resolved alert.", "resolved"),
    ],
    [
      {
        id: "run-weather-simulation",
        label: "Run Simulation",
        description: "Generate weather alerts from active rules and forecast snapshots.",
      },
    ]
  ),
  priceSignals: createEntityDefinition("priceSignals", "Price Signal", "Price Signals", ["new", "acknowledged", "investigating", "closed"], [
    textField("data.commodity", "Commodity"),
    textField("data.market", "Market"),
    textField("data.signal", "Signal"),
    numberField("data.confidence", "Confidence"),
  ]),
  cropCycles: createEntityDefinition("cropCycles", "Crop Cycle", "Crop Cycles", ["planned", "active", "completed"], [
    textField("data.plotId", "Plot ID"),
    dateField("data.plantingTarget", "Planting Target"),
    dateField("data.harvestTarget", "Harvest Target"),
  ]),
  growthStages: createEntityDefinition("growthStages", "Growth Stage", "Growth Stages", ["seed", "vegetative", "flowering", "maturity", "harvested"], [
    textField("data.cycleId", "Cycle ID"),
    textField("data.stage", "Stage"),
    dateField("data.observedAt", "Observed At"),
  ]),
  sensorReadings: createEntityDefinition("sensorReadings", "Sensor Reading", "Sensor Readings", ["captured", "flagged", "verified"], [
    textField("data.stationId", "Station ID"),
    textField("data.plotId", "Plot ID"),
    textField("data.metric", "Metric"),
    numberField("data.value", "Value"),
  ]),
  pestIncidents: createEntityDefinition(
    "pestIncidents",
    "Pest Incident",
    "Pest Incidents",
    ["created", "assigned", "resolved", "closed"],
    [
      textField("data.cropId", "Crop ID"),
      {
        key: "data.severity",
        label: "Severity",
        type: "select",
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ],
      },
      textField("data.photoUrl", "Photo URL Placeholder"),
    ],
    [
      statusAction("resolve-incident", "Resolve Incident", "Submit expert review and mark incident resolved.", "resolved"),
      statusAction("close-incident", "Close Incident", "Close incident after review.", "closed"),
    ]
  ),
  yieldPredictions: createEntityDefinition(
    "yieldPredictions",
    "Yield Prediction",
    "Yield Predictions",
    ["generated", "refreshed", "archived"],
    [
      textField("data.cropId", "Crop ID"),
      numberField("data.predictedYield", "Predicted Yield"),
      numberField("data.confidence", "Confidence"),
      numberField("data.horizonDays", "Horizon (days)"),
    ],
    [],
    [
      {
        id: "refresh-prediction",
        label: "Refresh Prediction",
        description: "Run model refresh and append history snapshot.",
      },
    ]
  ),
  warehouses: createEntityDefinition("warehouses", "Warehouse", "Warehouses", ["active", "maintenance", "inactive"], [
    textField("data.location", "Location"),
    numberField("data.capacity", "Capacity"),
  ]),
  storageBins: createEntityDefinition("storageBins", "Storage Bin", "Storage Bins", ["available", "occupied", "maintenance"], [
    textField("data.warehouseId", "Warehouse ID"),
    numberField("data.capacity", "Capacity"),
    { key: "data.temperatureControl", label: "Temperature Control", type: "switch" },
  ]),
  batches: createEntityDefinition("batches", "Batch", "Batches", ["received", "stored", "dispatched", "closed"], [
    textField("data.commodity", "Commodity"),
    numberField("data.quantity", "Quantity"),
    textField("data.grade", "Quality Grade"),
    textField("data.warehouseId", "Warehouse ID"),
    textField("data.binId", "Bin ID"),
  ]),
  qualityGrades: createEntityDefinition("qualityGrades", "Quality Grade", "Quality Grades", ["draft", "verified", "final"], [
    textField("data.batchId", "Batch ID"),
    textField("data.grade", "Grade"),
    textField("data.notes", "Notes"),
  ]),
  stockMovements: createEntityDefinition("stockMovements", "Stock Movement", "Stock Movements", ["draft", "confirmed", "completed", "rejected"], [
    textField("data.batchId", "Batch ID"),
    {
      key: "data.movementType",
      label: "Movement Type",
      type: "select",
      options: [
        { label: "Receive", value: "receive" },
        { label: "Transfer", value: "transfer" },
        { label: "Dispatch", value: "dispatch" },
      ],
    },
    numberField("data.quantity", "Quantity"),
    textField("data.sourceId", "Source"),
    textField("data.destinationId", "Destination"),
  ]),
  spoilageReports: createEntityDefinition("spoilageReports", "Spoilage Report", "Spoilage Reports", ["reported", "approved", "closed"], [
    textField("data.batchId", "Batch ID"),
    numberField("data.quantity", "Spoiled Quantity"),
    textField("data.cause", "Cause"),
  ]),
  listings: createEntityDefinition(
    "listings",
    "Listing",
    "Listings",
    ["draft", "published", "paused", "closed"],
    [
      textField("data.commodity", "Commodity"),
      textField("data.unit", "Unit"),
      numberField("data.price", "Price"),
      {
        key: "data.pricingMode",
        label: "Pricing Mode",
        type: "select",
        options: [
          { label: "Fixed", value: "fixed" },
          { label: "Negotiable", value: "negotiable" },
          { label: "Auction", value: "auction" },
        ],
      },
    ],
    [
      {
        id: "fetch-linked-media",
        label: "Fetch Media",
        description: "Load linked media metadata from media service.",
      },
    ]
  ),
  rfqs: createEntityDefinition("rfqs", "RFQ", "RFQs", ["open", "responded", "shortlisted", "closed"], [
    textField("data.commodity", "Commodity"),
    numberField("data.quantity", "Quantity"),
    numberField("data.targetPrice", "Target Price"),
    numberField("data.responseCount", "Responses"),
  ]),
  orders: createEntityDefinition("orders", "Order", "Orders", ["created", "accepted", "rejected", "fulfilled", "cancelled"], [
    textField("data.listingId", "Listing ID"),
    textField("data.buyer", "Buyer"),
    textField("data.seller", "Seller"),
    numberField("data.quantity", "Quantity"),
    numberField("data.amount", "Amount"),
  ]),
  contracts: createEntityDefinition(
    "contracts",
    "Contract",
    "Contracts",
    ["draft", "under_review", "active", "completed", "terminated"],
    [
      textField("data.partyA", "Party A"),
      textField("data.partyB", "Party B"),
      textField("data.milestones", "Milestones"),
      { key: "data.signed", label: "Signed", type: "switch" },
    ],
    [
      statusAction("sign-contract", "Sign", "Apply contract signature placeholder.", "active"),
      {
        id: "open-dispute",
        label: "Open Dispute",
        description: "Raise a dispute for this contract flow.",
      },
      {
        id: "resolve-dispute",
        label: "Resolve Dispute",
        description: "Submit dispute resolution decision.",
      },
      {
        id: "close-dispute",
        label: "Close Dispute",
        description: "Close dispute case with final summary.",
      },
    ]
  ),
  negotiations: createEntityDefinition(
    "negotiations",
    "Negotiation",
    "Negotiations",
    ["open", "agreed", "stalled", "closed"],
    [
      textField("data.orderId", "Order ID"),
      numberField("data.messageCount", "Message Count"),
      textField("data.lastMessage", "Last Message"),
    ],
    [],
    [
      {
        id: "send-message",
        label: "Send Message",
        description: "Append a chat-like message to the thread locally.",
      },
    ]
  ),
  reviews: createEntityDefinition("reviews", "Review", "Reviews", ["draft", "published", "hidden"], [
    textField("data.orderId", "Order ID"),
    numberField("data.rating", "Rating"),
    textField("data.reviewText", "Review"),
  ]),
  shipments: createEntityDefinition("shipments", "Shipment", "Shipments", ["planned", "in_transit", "delivered", "cancelled"], [
    textField("data.orderId", "Order ID"),
    textField("data.routeId", "Route ID"),
    textField("data.vehicleId", "Vehicle ID"),
    textField("data.driverId", "Driver ID"),
  ]),
  routes: createEntityDefinition("routes", "Route", "Routes", ["draft", "active", "archived"], [
    textField("data.origin", "Origin"),
    textField("data.destination", "Destination"),
    numberField("data.distanceKm", "Distance (km)"),
  ]),
  vehicles: createEntityDefinition("vehicles", "Vehicle", "Vehicles", ["available", "assigned", "maintenance", "inactive"], [
    textField("data.registration", "Registration"),
    numberField("data.capacityKg", "Capacity (kg)"),
    { key: "data.coldChainEnabled", label: "Cold Chain", type: "switch" },
    { key: "data.available", label: "Available", type: "switch" },
  ]),
  drivers: createEntityDefinition("drivers", "Driver", "Drivers", ["available", "assigned", "inactive"], [
    textField("data.phone", "Phone"),
    textField("data.licenseNumber", "License Number"),
    { key: "data.available", label: "Available", type: "switch" },
  ]),
  trackingEvents: createEntityDefinition("trackingEvents", "Tracking Event", "Tracking Events", ["created", "verified", "closed"], [
    textField("data.shipmentId", "Shipment ID"),
    textField("data.location", "Location"),
    textField("data.note", "Note"),
  ]),
  coldChainLogs: createEntityDefinition(
    "coldChainLogs",
    "Cold Chain Log",
    "Cold Chain Logs",
    ["normal", "violation", "resolved"],
    [
      textField("data.shipmentId", "Shipment ID"),
      numberField("data.temperatureC", "Temperature (C)"),
      numberField("data.thresholdC", "Threshold (C)"),
      { key: "data.violation", label: "Violation", type: "switch" },
    ],
    [],
    [
      {
        id: "flag-violations",
        label: "Flag Violations",
        description: "Scan logs and create violation notifications.",
      },
    ]
  ),
  wallets: createEntityDefinition(
    "wallets",
    "Wallet",
    "Wallets",
    ["active", "frozen"],
    [
      textField("data.ownerId", "Owner ID"),
      numberField("data.balance", "Balance"),
      textField("data.currency", "Currency"),
    ],
    [],
    [
      { id: "wallet-topup", label: "Top-up", description: "Top-up wallet placeholder action." },
      { id: "wallet-transfer", label: "Transfer", description: "Transfer wallet balance placeholder." },
    ]
  ),
  transactions: createEntityDefinition("transactions", "Transaction", "Transactions", ["pending", "completed", "failed", "reversed"], [
    textField("data.walletId", "Wallet ID"),
    {
      key: "data.transactionType",
      label: "Type",
      type: "select",
      options: [
        { label: "Credit", value: "credit" },
        { label: "Debit", value: "debit" },
      ],
    },
    numberField("data.amount", "Amount"),
    textField("data.reference", "Reference"),
  ]),
  escrowAccounts: createEntityDefinition(
    "escrowAccounts",
    "Escrow Account",
    "Escrow Accounts",
    ["created", "funded", "released", "refunded", "closed"],
    [
      textField("data.orderId", "Order ID"),
      numberField("data.amount", "Amount"),
      textField("data.releaseCondition", "Release Condition"),
    ],
    [
      statusAction("release-escrow", "Release", "Release escrowed funds.", "released"),
      statusAction("refund-escrow", "Refund", "Refund escrow balance.", "refunded"),
    ]
  ),
  payouts: createEntityDefinition("payouts", "Payout", "Payouts", ["requested", "processing", "paid", "failed"], [
    textField("data.beneficiaryId", "Beneficiary ID"),
    numberField("data.amount", "Amount"),
    textField("data.method", "Method"),
  ]),
  invoices: createEntityDefinition(
    "invoices",
    "Invoice",
    "Invoices",
    ["draft", "issued", "paid", "overdue", "cancelled"],
    [
      textField("data.orderId", "Order ID"),
      numberField("data.amount", "Amount"),
      dateField("data.dueDate", "Due Date"),
    ],
    [],
    [
      {
        id: "export-invoice",
        label: "Export PDF",
        description: "Mock invoice export action.",
      },
    ]
  ),
  credits: createEntityDefinition(
    "credits",
    "Credit Application",
    "Credit Applications",
    ["applied", "under_review", "approved", "rejected", "disbursed"],
    [
      textField("data.applicantId", "Applicant ID"),
      numberField("data.requestedAmount", "Requested Amount"),
      numberField("data.score", "Mock Score"),
    ],
    [
      statusAction("approve-credit", "Approve", "Approve credit request.", "approved"),
      statusAction("reject-credit", "Reject", "Reject credit request.", "rejected"),
      statusAction("disburse-credit", "Disburse", "Disburse approved credit.", "disbursed"),
    ]
  ),
  insurancePolicies: createEntityDefinition("insurancePolicies", "Insurance Policy", "Insurance Policies", ["active", "claim_open", "claim_resolved", "expired"], [
    textField("data.policyNumber", "Policy Number"),
    textField("data.provider", "Provider"),
    numberField("data.coverageAmount", "Coverage"),
    textField("data.claimStatus", "Claim Status"),
  ]),
  stations: createEntityDefinition(
    "stations",
    "Station",
    "Stations",
    ["online", "offline", "maintenance"],
    [
      textField("data.location", "Location"),
      numberField("data.lat", "Latitude"),
      numberField("data.lng", "Longitude"),
      {
        key: "data.stationStatus",
        label: "Station Status",
        type: "select",
        options: [
          { label: "Online", value: "online" },
          { label: "Offline", value: "offline" },
        ],
      },
      dateField("data.lastReadingAt", "Last Reading"),
    ],
    [
      {
        id: "refresh-profile-weather",
        label: "Refresh Profile",
        description: "Run admin weather refresh for this station profile.",
      },
    ],
    [
      {
        id: "refresh-weather-admin",
        label: "Refresh All Weather",
        description: "Run weather refresh across all profiles.",
      },
      {
        id: "check-weather-providers",
        label: "Provider Health",
        description: "Check weather provider health statuses.",
      },
      {
        id: "retry-weather-deliveries",
        label: "Retry Deliveries",
        description: "Retry failed weather alert deliveries.",
      },
      {
        id: "expire-weather-alerts",
        label: "Expire Alerts",
        description: "Expire stale weather alerts from admin queue.",
      },
      {
        id: "prune-weather-snapshots",
        label: "Prune Snapshots",
        description: "Prune old weather forecast snapshots.",
      },
    ]
  ),
  forecasts: createEntityDefinition(
    "forecasts",
    "Forecast",
    "Forecasts",
    ["generated", "refreshed", "expired"],
    [
      textField("data.stationId", "Station ID"),
      textField("data.location", "Location"),
      numberField("data.horizonDays", "Horizon (days)"),
      textField("data.summary", "Summary"),
    ],
    [],
    [
      {
        id: "refresh-forecast",
        label: "Refresh Forecast",
        description: "Fetch latest 7-day forecast placeholder.",
      },
    ]
  ),
  alertRules: createEntityDefinition(
    "alertRules",
    "Alert Rule",
    "Alert Rules",
    ["draft", "active", "disabled"],
    [
      textField("data.condition", "Condition"),
      textField("data.action", "Action"),
      { key: "data.enabled", label: "Enabled", type: "switch" },
    ],
    [
      statusAction("activate-rule", "Activate", "Activate rule for simulator.", "active"),
      statusAction("disable-rule", "Disable", "Disable rule from alert engine.", "disabled"),
    ],
    [
      {
        id: "test-rule",
        label: "Test Rule",
        description: "Run rule test against sample weather payload.",
      },
    ]
  ),
  commodities: createEntityDefinition(
    "commodities",
    "Commodity",
    "Commodities",
    ["active", "inactive"],
    [
      textField("data.unit", "Unit"),
      textField("data.grade", "Grade"),
    ],
    [
      {
        id: "fetch-market-insights",
        label: "Fetch Insights",
        description: "Load market intelligence insight snapshot.",
      },
      {
        id: "fetch-market-trends",
        label: "Fetch Trends",
        description: "Load market trend series for this commodity.",
      },
      {
        id: "compare-market-regions",
        label: "Compare Regions",
        description: "Compare market conditions across regions.",
      },
    ]
  ),
  marketPrices: createEntityDefinition(
    "marketPrices",
    "Market Price",
    "Market Prices",
    ["captured", "validated", "published"],
    [
      textField("data.commodityId", "Commodity ID"),
      textField("data.market", "Market"),
      numberField("data.price", "Price"),
      dateField("data.observedAt", "Observed At"),
    ],
    [],
    [
      {
        id: "import-prices",
        label: "Import Prices",
        description: "Placeholder import action for price feeds.",
      },
    ]
  ),
  priceEstimations: createEntityDefinition("priceEstimations", "Price Estimation", "Price Estimations", ["draft", "submitted", "approved"], [
    textField("data.commodityId", "Commodity ID"),
    textField("data.market", "Market"),
    numberField("data.estimatedPrice", "Estimated Price"),
    textField("data.assumptions", "Assumptions"),
  ]),
  pricePredictions: createEntityDefinition(
    "pricePredictions",
    "Price Prediction",
    "Price Predictions",
    ["generated", "compared", "archived"],
    [
      textField("data.commodityId", "Commodity ID"),
      numberField("data.horizonDays", "Horizon"),
      numberField("data.confidence", "Confidence"),
      textField("data.series", "Prediction Series"),
    ],
    [],
    [
      {
        id: "generate-prediction",
        label: "Generate Prediction",
        description: "Generate and store a prediction series run.",
      },
    ]
  ),
  recommendations: createEntityDefinition(
    "recommendations",
    "Recommendation",
    "Recommendations",
    ["draft", "approved", "published", "retracted"],
    [
      textField("data.commodityId", "Commodity ID"),
      textField("data.recommendationType", "Type"),
      textField("data.rationale", "Rationale"),
    ],
    [
      statusAction("approve-recommendation", "Approve", "Approve recommendation record.", "approved"),
      statusAction("publish-recommendation", "Publish", "Publish recommendation to users.", "published"),
    ],
    [
      {
        id: "generate-recommendation",
        label: "Generate",
        description: "Create recommendation from prediction snapshot.",
      },
    ]
  ),
  marketSignals: createEntityDefinition("marketSignals", "Market Signal", "Market Signals", ["new", "investigating", "investigated", "dismissed"], [
    textField("data.commodityId", "Commodity ID"),
    numberField("data.anomalyScore", "Anomaly Score"),
    { key: "data.investigated", label: "Investigated", type: "switch" },
    textField("data.notes", "Notes"),
  ]),
  dataSources: createEntityDefinition(
    "dataSources",
    "Data Source",
    "Data Sources",
    ["active", "paused", "disabled"],
    [
      textField("data.provider", "Provider"),
      textField("data.endpoint", "Endpoint"),
      { key: "data.enabled", label: "Enabled", type: "switch" },
    ],
    [],
    [
      {
        id: "refresh-source",
        label: "Refresh",
        description: "Trigger data source refresh placeholder.",
      },
    ]
  ),
  knowledgeBaseArticles: createEntityDefinition("knowledgeBaseArticles", "Article", "Knowledge Base Articles", ["draft", "published", "unpublished", "archived"], [
    textField("data.category", "Category"),
    textField("data.tags", "Tags"),
    textField("data.body", "Article Body"),
  ]),
  researchReports: createEntityDefinition("researchReports", "Research Report", "Research Reports", ["draft", "in_review", "published", "archived"], [
    textField("data.summary", "Summary"),
    textField("data.datasetRef", "Dataset Ref"),
  ]),
  fieldCases: createEntityDefinition("fieldCases", "Field Case", "Field Cases", ["created", "assigned", "in_visit", "resolved", "closed"], [
    textField("data.farmerId", "Farmer ID"),
    textField("data.assignedOfficer", "Assigned Officer"),
    dateField("data.visitSchedule", "Visit Schedule"),
    textField("data.notes", "Notes"),
  ]),
  assignments: createEntityDefinition("assignments", "Assignment", "Assignments", ["created", "assigned", "completed", "cancelled"], [
    textField("data.assignee", "Assignee"),
    dateField("data.dueDate", "Due Date"),
    textField("data.relatedEntityId", "Related Entity ID"),
  ]),
  reviewQueue: createEntityDefinition("reviewQueue", "Review Queue Item", "Review Queue", ["queued", "in_review", "approved", "rejected"], [
    textField("data.relatedEntity", "Related Entity"),
    textField("data.reviewer", "Reviewer"),
    textField("data.comments", "Comments"),
  ]),
  datasets: createEntityDefinition("datasets", "Dataset", "Datasets", ["active", "deprecated"], [
    textField("data.source", "Source"),
    textField("data.schemaVersion", "Schema Version"),
  ]),
  charts: createEntityDefinition(
    "charts",
    "Chart",
    "Charts",
    ["draft", "published", "archived"],
    [
      textField("data.datasetId", "Dataset ID"),
      textField("data.metric", "Metric"),
      textField("data.dimension", "Dimension"),
      textField("data.filters", "Filters"),
      {
        key: "data.shareScope",
        label: "Share Scope",
        type: "select",
        options: [
          { label: "Private", value: "private" },
          { label: "Org", value: "org" },
          { label: "Public", value: "public" },
        ],
      },
    ],
    [],
    [
      {
        id: "preview-chart",
        label: "Preview",
        description: "Preview chart configuration placeholder.",
      },
    ]
  ),
  dashboards: createEntityDefinition(
    "dashboards",
    "Dashboard",
    "Dashboards",
    ["draft", "published", "archived"],
    [
      textField("data.chartIds", "Chart IDs"),
      textField("data.layout", "Layout JSON"),
    ],
    [],
    [
      {
        id: "reorder-charts",
        label: "Reorder Charts",
        description: "Reorder dashboard widgets placeholder.",
      },
    ]
  ),
  reports: createEntityDefinition(
    "reports",
    "Report",
    "Reports",
    ["generated", "exported", "archived"],
    [
      textField("data.dashboardId", "Dashboard ID"),
      {
        key: "data.format",
        label: "Format",
        type: "select",
        options: [
          { label: "PDF", value: "pdf" },
          { label: "CSV", value: "csv" },
          { label: "DOC", value: "doc" },
        ],
      },
    ],
    [],
    [
      {
        id: "export-report",
        label: "Export",
        description: "Mock report export flow.",
      },
    ]
  ),
  templates: createEntityDefinition("templates", "Template", "Templates", ["draft", "published", "archived"], [
    {
      key: "data.basedOnType",
      label: "Based On",
      type: "select",
      options: [
        { label: "Chart", value: "chart" },
        { label: "Dashboard", value: "dashboard" },
      ],
    },
    textField("data.basedOnId", "Based On ID"),
    {
      key: "data.shareScope",
      label: "Share Scope",
      type: "select",
      options: [
        { label: "Private", value: "private" },
        { label: "Org", value: "org" },
        { label: "Public", value: "public" },
      ],
    },
  ]),
  users: createEntityDefinition("users", "User", "Users", ["active", "disabled"], [
    textField("data.name", "Name"),
    textField("data.email", "Email"),
    textField("data.orgId", "Org ID"),
    textField("data.roles", "Roles"),
  ]),
  orgs: createEntityDefinition("orgs", "Organization", "Organizations", ["active", "disabled"], [
    textField("data.name", "Name"),
    textField("data.enabledModules", "Enabled Workspaces"),
  ]),
  roles: createEntityDefinition("roles", "Role", "Roles", ["active", "deprecated"], [
    textField("data.name", "Role Name"),
    textField("data.permissions", "Permissions"),
  ]),
  permissions: createEntityDefinition("permissions", "Permission", "Permissions", ["active", "deprecated"], [
    textField("data.code", "Code"),
    textField("data.description", "Description"),
  ]),
  apiTokens: createEntityDefinition(
    "apiTokens",
    "API Token",
    "API Tokens",
    ["active", "revoked", "expired"],
    [
      textField("data.name", "Token Name"),
      textField("data.scopes", "Scopes"),
      numberField("data.rateLimit", "Rate Limit"),
      dateField("data.expiresAt", "Expiry"),
      { key: "data.revoked", label: "Revoked", type: "switch" },
    ],
    [
      statusAction("revoke-token", "Revoke", "Revoke token permanently.", "revoked"),
      {
        id: "rotate-token-secret",
        label: "Rotate Secret",
        description: "Rotate API token secret and invalidate old secret.",
      },
      {
        id: "view-token-usage",
        label: "View Usage",
        description: "Fetch token usage snapshot from API.",
      },
    ],
    [
      {
        id: "create-token",
        label: "Create Token",
        description: "Create token and show value once modal.",
      },
    ]
  ),
  moduleToggles: createEntityDefinition("moduleToggles", "Module Toggle", "Module Toggles", ["enabled", "disabled"], [
    textField("data.orgId", "Organization ID"),
    {
      key: "data.workspace",
      label: "Workspace",
      type: "select",
      options: WORKSPACES.map((workspace) => ({ label: workspace.label, value: workspace.id })),
    },
    { key: "data.enabled", label: "Enabled", type: "switch" },
  ]),
};

export function entityPermissions(entityKey: EntityKey): Permission[] {
  return ["read", "write", "delete", "status"].map(
    (action) => `entity.${entityKey}.${action}` as Permission
  );
}

export function workspacePermission(workspaceId: WorkspaceId): Permission {
  return `workspace.${workspaceId}.access`;
}

export function buildWorkspacePermissions(workspaceId: WorkspaceId): Permission[] {
  return [workspacePermission(workspaceId), ...WORKSPACE_ENTITY_MAP[workspaceId].flatMap((entity) => entityPermissions(entity))];
}

function uniqPermissions(values: Permission[]): Permission[] {
  return [...new Set(values)];
}

const allWorkspacePermissions = WORKSPACES.flatMap((workspace) => buildWorkspacePermissions(workspace.id));
const allEntityPermissions = (Object.keys(ENTITY_DEFINITIONS) as EntityKey[]).flatMap((entity) => entityPermissions(entity));

export const ALL_PERMISSIONS: Permission[] = uniqPermissions([
  ...allWorkspacePermissions,
  ...allEntityPermissions,
  "global.search",
  "notifications.read",
  "admin.audit.read",
  "admin.config.write",
]);

function rolePermissions(...items: Permission[]): Permission[] {
  return uniqPermissions(items);
}

function permissionsForWorkspaces(workspaces: WorkspaceId[]): Permission[] {
  return uniqPermissions(workspaces.flatMap((workspace) => buildWorkspacePermissions(workspace)));
}

export const ROLE_DEFINITIONS: Record<RoleId, RoleDefinition> = {
  farmer_agent: {
    id: "farmer_agent",
    label: "Farmer Agent",
    permissions: rolePermissions(
      ...permissionsForWorkspaces(["farmer"]),
      ...entityPermissions("advisories"),
      ...entityPermissions("weatherAlerts"),
      ...entityPermissions("priceSignals"),
      "global.search",
      "notifications.read"
    ),
  },
  production_manager: {
    id: "production_manager",
    label: "Production Manager",
    permissions: rolePermissions(...permissionsForWorkspaces(["production"]), "global.search", "notifications.read"),
  },
  inventory_manager: {
    id: "inventory_manager",
    label: "Inventory Manager",
    permissions: rolePermissions(...permissionsForWorkspaces(["aggregation"]), "global.search", "notifications.read"),
  },
  market_operator: {
    id: "market_operator",
    label: "Marketplace Operator",
    permissions: rolePermissions(...permissionsForWorkspaces(["marketplace"]), "global.search", "notifications.read"),
  },
  logistics_coordinator: {
    id: "logistics_coordinator",
    label: "Logistics Coordinator",
    permissions: rolePermissions(...permissionsForWorkspaces(["logistics"]), "global.search", "notifications.read"),
  },
  finance_officer: {
    id: "finance_officer",
    label: "Finance Officer",
    permissions: rolePermissions(...permissionsForWorkspaces(["finance"]), "global.search", "notifications.read"),
  },
  weather_analyst: {
    id: "weather_analyst",
    label: "Weather Analyst",
    permissions: rolePermissions(...permissionsForWorkspaces(["weather"]), "global.search", "notifications.read"),
  },
  price_analyst: {
    id: "price_analyst",
    label: "Price Analyst",
    permissions: rolePermissions(...permissionsForWorkspaces(["prices"]), "global.search", "notifications.read"),
  },
  expert_officer: {
    id: "expert_officer",
    label: "Expert Officer",
    permissions: rolePermissions(...permissionsForWorkspaces(["expert"]), "global.search", "notifications.read"),
  },
  analytics_lead: {
    id: "analytics_lead",
    label: "Analytics Lead",
    permissions: rolePermissions(...permissionsForWorkspaces(["analytics"]), "global.search", "notifications.read"),
  },
  org_admin: {
    id: "org_admin",
    label: "Organization Admin",
    permissions: rolePermissions(
      ...permissionsForWorkspaces(WORKSPACES.map((workspace) => workspace.id)),
      "global.search",
      "notifications.read",
      "admin.audit.read",
      "admin.config.write"
    ),
  },
  super_admin: {
    id: "super_admin",
    label: "Super Admin",
    permissions: rolePermissions(...ALL_PERMISSIONS),
  },
};

export const CREDENTIAL_HINTS = [
  { email: "superadmin@clycites.io", password: "super123", role: "super_admin" },
  { email: "ops@clycites.io", password: "ops12345", role: "org_admin" },
  { email: "farmer@clycites.io", password: "farmer123", role: "farmer_agent" },
  { email: "expert@clycites.io", password: "expert123", role: "expert_officer" },
];

export const SEARCHABLE_ENTITIES: EntityKey[] = ["listings", "advisories", "weatherAlerts", "orders", "shipments", "marketSignals"];

export function getWorkspaceDefinition(workspaceId: string): WorkspaceDefinition | undefined {
  return WORKSPACES.find((workspace) => workspace.id === workspaceId);
}

export function getEntityDefinition(entityKey: string): EntityDefinition | undefined {
  return (ENTITY_DEFINITIONS as Record<string, EntityDefinition | undefined>)[entityKey];
}

export function belongsToWorkspace(workspaceId: WorkspaceId, entityKey: EntityKey): boolean {
  return WORKSPACE_ENTITY_MAP[workspaceId].includes(entityKey);
}
