"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/lib/api/mock";
import { useMockSession } from "@/lib/auth/mock-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const { session } = useMockSession();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => notificationsService.list({ page, pageSize: 20 }),
    enabled: Boolean(session),
  });

  const toggleMutation = useMutation({
    mutationFn: (payload: { id: string; read: boolean }) => {
      if (!session) throw new Error("No session");
      return payload.read
        ? notificationsService.markUnread(payload.id, session.user.id)
        : notificationsService.markRead(payload.id, session.user.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications Center</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(query.data?.items ?? []).map((notification) => (
          <div key={notification.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{notification.title}</p>
                  {!notification.read && <Badge>New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                {notification.link && (
                  <Link href={notification.link} className="text-xs text-primary hover:underline">
                    Open linked entity
                  </Link>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleMutation.mutate({ id: notification.id, read: notification.read })}
              >
                Mark {notification.read ? "unread" : "read"}
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Prev
          </Button>
          <Button
            variant="outline"
            disabled={(query.data?.pagination.total ?? 0) <= page * 20}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
