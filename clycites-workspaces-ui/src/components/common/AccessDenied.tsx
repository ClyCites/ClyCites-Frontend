import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border bg-card p-10 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You do not have the required permission for this workspace or action.
      </p>
      <Button asChild className="mt-6">
        <Link href="/app">Back to app</Link>
      </Button>
    </div>
  );
}
