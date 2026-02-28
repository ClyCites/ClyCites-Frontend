import { describe, expect, it } from "vitest";
import { entityServices } from "@/lib/api/mock/entities";
import { globalSearch, listNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/store";

const ACTOR_ID = "usr-ops";

describe("Notifications, audit visibility, and global search", () => {
  it("supports search and notification read/unread transitions", async () => {
    const uniqueSuffix = `${Date.now()}`;
    const listing = await entityServices.listings.createX({
      actorId: ACTOR_ID,
      title: `Premium maize lot ${uniqueSuffix}`,
      subtitle: "Marketplace listing for export grade maize",
      data: {
        commodity: "maize",
        quantity: 1200,
        price: 980,
      },
      tags: ["maize", "export"],
    });

    const searchResults = await globalSearch(uniqueSuffix);
    expect(searchResults.some((item) => item.id === listing.id && item.entity === "listings")).toBe(true);

    const initialNotifications = await listNotifications({ page: 1, pageSize: 25 });
    const createdNotification = initialNotifications.items.find((item) => item.entityId === listing.id);
    expect(createdNotification).toBeDefined();

    if (createdNotification) {
      await markNotificationRead(createdNotification.id, true, ACTOR_ID);
      const afterRead = await listNotifications({ page: 1, pageSize: 25 });
      const readNotification = afterRead.items.find((item) => item.id === createdNotification.id);
      expect(readNotification?.read).toBe(true);
    }

    await markAllNotificationsRead(ACTOR_ID);
    const allRead = await listNotifications({ page: 1, pageSize: 50 });
    expect(allRead.items.every((item) => item.read)).toBe(true);
  });
});
