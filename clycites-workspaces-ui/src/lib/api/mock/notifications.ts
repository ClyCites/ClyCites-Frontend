import { listNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/store";
import type { NotificationFilterParams } from "@/lib/store/types";

export const notificationsService = {
  list(params: NotificationFilterParams) {
    return listNotifications(params);
  },
  markRead(notificationId: string, actorId: string) {
    return markNotificationRead(notificationId, true, actorId);
  },
  markUnread(notificationId: string, actorId: string) {
    return markNotificationRead(notificationId, false, actorId);
  },
  markAllRead(actorId: string) {
    return markAllNotificationsRead(actorId);
  },
  async getUnreadCount() {
    const result = await listNotifications({
      page: 1,
      pageSize: 500,
      unreadOnly: true,
    });
    return result.pagination.total;
  },
  async listTemplates() {
    return [
      { id: "tpl-order-confirmed", key: "order_confirmed", channels: ["in_app", "email"] },
      { id: "tpl-alert-escalated", key: "alert_escalated", channels: ["in_app", "sms"] },
    ];
  },
  async retryFailed() {
    return {
      queued: 0,
      retried: 0,
    };
  },
  async expireOld() {
    return {
      expired: 0,
    };
  },
};
