"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { notificationsService } from "@/lib/api/mock";
import { useMockSession } from "@/lib/auth/mock-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationsCenter() {
  const { session } = useMockSession();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", session?.activeWorkspace],
    queryFn: () =>
      notificationsService.list({
        page: 1,
        pageSize: 10,
        workspace: session?.activeWorkspace ?? undefined,
      }),
    enabled: Boolean(session),
  });

  const markMutation = useMutation({
    mutationFn: (notificationId: string) => {
      if (!session) throw new Error("No session");
      return notificationsService.markRead(notificationId, session.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => {
      if (!session) throw new Error("No session");
      return notificationsService.markAllRead(session.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = query.data?.items ?? [];
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1 text-[10px]" variant="destructive">
              {unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Button variant="ghost" size="sm" onClick={() => markAllMutation.mutate()}>
            Mark all read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-1 py-3"
              onClick={() => {
                if (!notification.read) {
                  markMutation.mutate(notification.id);
                }
              }}
            >
              <div className="flex w-full items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
              </div>
              {notification.link && (
                <Link href={notification.link} className="text-xs text-primary underline-offset-2 hover:underline">
                  Open
                </Link>
              )}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/notifications">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
