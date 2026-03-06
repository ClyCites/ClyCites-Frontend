import { describe, expect, it } from "vitest";
import { entityServices } from "@/lib/api/mock/entities";
import { listAuditLogs, listNotifications } from "@/lib/store";

const ACTOR_ID = "usr-ops";

describe("Entity CRUD and status workflows", () => {
  it("writes audit trail and notifications for create/update/status/delete", async () => {
    const created = await entityServices.advisories.createX({
      actorId: ACTOR_ID,
      title: "Late blight prevention advisory",
      subtitle: "Apply preventative fungicide in high humidity periods.",
      data: {
        targetGroup: "potato_farmers",
        region: "Central",
      },
      tags: ["potato", "disease"],
    });

    await entityServices.advisories.updateX(created.id, {
      actorId: ACTOR_ID,
      title: "Late blight prevention advisory v2",
      data: {
        region: "Western",
      },
    });

    await entityServices.advisories.changeStatus(created.id, ACTOR_ID, "published", "Reviewed and approved");
    await entityServices.advisories.deleteX(created.id, ACTOR_ID);

    const audits = await listAuditLogs({
      page: 1,
      pageSize: 100,
      entityType: "advisories",
    });

    const relevantAudits = audits.items.filter((item) => item.entityId === created.id);
    expect(relevantAudits.some((item) => item.action === "create")).toBe(true);
    expect(relevantAudits.some((item) => item.action === "update")).toBe(true);
    expect(relevantAudits.some((item) => item.action === "status_change")).toBe(true);
    expect(relevantAudits.some((item) => item.action === "delete")).toBe(true);

    const notifications = await listNotifications({
      page: 1,
      pageSize: 100,
    });

    expect(
      notifications.items.some((item) => item.entityType === "advisories" && item.entityId === created.id)
    ).toBe(true);
  });
});
