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
};
