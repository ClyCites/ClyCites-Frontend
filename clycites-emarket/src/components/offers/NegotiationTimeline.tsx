import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { Offer, OfferHistoryEvent } from "@/lib/api/types/offer.types";
import { cn } from "@/lib/utils";

interface NegotiationTimelineProps {
  offer: Offer;
  className?: string;
}

export function NegotiationTimeline({ offer, className }: NegotiationTimelineProps) {
  const history: OfferHistoryEvent[] = offer.history ?? [];

  if (!history.length) {
    return (
      <div className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
        No negotiation history yet.
      </div>
    );
  }

  return (
    <div className={cn("relative space-y-0", className)}>
      {history.map((event, idx) => {
        const actorName = typeof event.actor === "string"
          ? event.actor
          : (event.actor as { name?: string })?.name ?? "User";

        const isLast = idx === history.length - 1;

        return (
          <div key={idx} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <Avatar className="h-8 w-8 shrink-0 bg-primary/10">
                <AvatarFallback className="text-xs text-primary bg-primary/10">
                  {getInitials(actorName)}
                </AvatarFallback>
              </Avatar>
              {!isLast && <div className="mt-1 w-px flex-1 bg-border min-h-[2rem]" />}
            </div>

            {/* Content */}
            <div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0")}>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-medium">{actorName}</span>
                <span className="text-xs text-muted-foreground capitalize">{event.action.toLowerCase().replace("_", " ")}</span>
                <span className="ml-auto text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
              </div>

              <div className="mt-1.5 rounded-lg border bg-muted/40 px-3 py-2 text-sm space-y-1">
                {event.price != null && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground text-xs">Price</span>
                    <span className="font-medium text-xs">{formatCurrency(event.price)}</span>
                  </div>
                )}
                {event.quantity != null && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground text-xs">Quantity</span>
                    <span className="font-medium text-xs">{event.quantity}</span>
                  </div>
                )}
                {event.message && <p className="text-xs text-foreground mt-1 italic">&ldquo;{event.message}&rdquo;</p>}
              </div>
            </div>
          </div>
        );
      })}

      {/* Current status */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Current status:</span>
        <OfferStatusBadge status={offer.status} />
      </div>
    </div>
  );
}
