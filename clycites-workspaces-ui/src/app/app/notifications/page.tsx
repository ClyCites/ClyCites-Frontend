"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { notificationsService } from "@/lib/api";
import { useMockSession } from "@/lib/auth/mock-session";
import { queryKeys } from "@/lib/query/keys";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";

export default function NotificationsPage() {
  const { session, can } = useMockSession();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: queryKeys.notifications.byPage(page),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
  const templatesQuery = useQuery({
    queryKey: queryKeys.notifications.templates(),
    queryFn: () => notificationsService.listTemplates(),
    enabled: Boolean(session) && can("admin.config.write"),
  });
  const retryFailedMutation = useMutation({
    mutationFn: () => notificationsService.retryFailed(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
      toast({
        title: "Retry queued",
        description: `${result.retried} notifications retried.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Retry failed",
        description: error instanceof Error ? error.message : "Unable to retry failed notifications.",
        variant: "destructive",
      });
    },
  });
  const expireMutation = useMutation({
    mutationFn: () => notificationsService.expireOld(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root() });
      toast({
        title: "Expired old notifications",
        description: `${result.expired} notifications expired.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Expire failed",
        description: error instanceof Error ? error.message : "Unable to expire old notifications.",
        variant: "destructive",
      });
    },
  });

  const notifications = query.data?.items ?? [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Notifications Center"
        subtitle="Track advisory updates, workflow actions, and escalations across workspaces."
        breadcrumbs={[{ label: "App", href: "/app" }, { label: "Notifications" }]}
        actions={
          can("admin.config.write") ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => retryFailedMutation.mutate()}
                loading={retryFailedMutation.isPending}
              >
                Retry Failed
              </Button>
              <Button
                variant="outline"
                onClick={() => expireMutation.mutate()}
                loading={expireMutation.isPending}
              >
                Expire Old
              </Button>
              <Badge variant="outline">
                Templates: {templatesQuery.data?.length ?? 0}
              </Badge>
            </div>
          ) : undefined
        }
      />

      <Card>
        <CardContent className="space-y-3 pt-6">
          {query.isLoading ? (
            <LoadingSkeletons />
          ) : query.error ? (
            <div className="space-y-3 rounded-xl border border-destructive/40 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">
                {query.error instanceof Error ? query.error.message : "Unable to load notifications."}
              </p>
              <Button variant="outline" onClick={() => query.refetch()}>
                Retry
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState title="No notifications" description="Everything is clear for now." />
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="rounded-xl border border-border/60 bg-background/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      {!notification.read && (
                        <Badge>
                          <Bell className="h-3 w-3" /> New
                        </Badge>
                      )}
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
            ))
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
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
    </div>
  );
}
