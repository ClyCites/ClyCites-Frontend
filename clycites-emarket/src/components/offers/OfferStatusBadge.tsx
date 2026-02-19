import { Badge } from "@/components/ui/badge";
import { OfferStatus } from "@/lib/api/types/offer.types";
import type { BadgeProps } from "@/components/ui/badge";

const statusConfig: Record<OfferStatus, { label: string; variant: BadgeProps["variant"] }> = {
  PENDING:   { label: "Pending",   variant: "warning" },
  COUNTERED: { label: "Countered", variant: "secondary" },
  ACCEPTED:  { label: "Accepted",  variant: "success" },
  REJECTED:  { label: "Rejected",  variant: "destructive" },
  EXPIRED:   { label: "Expired",   variant: "muted" },
  WITHDRAWN: { label: "Withdrawn", variant: "muted" },
};

interface OfferStatusBadgeProps {
  status: OfferStatus;
  className?: string;
}

export function OfferStatusBadge({ status, className }: OfferStatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: "muted" as const };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
