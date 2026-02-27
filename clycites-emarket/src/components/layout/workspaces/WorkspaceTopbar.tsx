"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceSwitcher } from "@/components/layout/workspaces/WorkspaceSwitcher";
import { NotificationsCenter } from "@/components/layout/workspaces/NotificationsCenter";
import { useMockSession } from "@/lib/auth/mock-session";

export function WorkspaceTopbar() {
  const router = useRouter();
  const { session, logout } = useMockSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Link href="/app" className="text-lg font-semibold">
          ClyCites
        </Link>

        <WorkspaceSwitcher />

        <div className="hidden flex-1 items-center xl:flex">
          <Button variant="outline" className="w-full max-w-md justify-start" onClick={() => router.push("/app/search")}>
            <Search className="mr-2 h-4 w-4" />
            Global search
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <NotificationsCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">{session?.user.name ?? "Profile"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">{session?.user.name}</div>
                <div className="text-xs text-muted-foreground">{session?.user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/notifications">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auth/profile">Auth Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  router.replace("/auth/login");
                }}
                className="text-destructive focus:text-destructive"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
