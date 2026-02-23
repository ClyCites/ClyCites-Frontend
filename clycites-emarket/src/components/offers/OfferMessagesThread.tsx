"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";
import { useOfferMessages, useSendOfferMessage, useMarkMessagesRead } from "@/lib/query/offers.hooks";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { Offer, OfferMessage } from "@/lib/api/types/offer.types";
import { cn } from "@/lib/utils";

interface OfferMessagesThreadProps {
  offer: Offer;
  className?: string;
}

export function OfferMessagesThread({ offer, className }: OfferMessagesThreadProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useOfferMessages(offer.id);
  const { mutate: sendMessage, isPending: sending } = useSendOfferMessage(offer.id);
  const { mutate: markRead } = useMarkMessagesRead(offer.id);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (messages.length > 0) {
      markRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const handleSend = () => {
    if (!message.trim() || sending) return;
    sendMessage(message.trim(), {
      onSuccess: () => setMessage(""),
    });
  };

  const buyerName = typeof offer.buyer === "string"
    ? "Buyer"
    : `${offer.buyer.firstName} ${offer.buyer.lastName}`;
  
  const sellerName = typeof offer.seller === "string"
    ? "Seller"
    : `${offer.seller.firstName} ${offer.seller.lastName}`;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-3">
        {/* Messages list */}
        <ScrollArea ref={scrollRef} className="h-[300px] pr-3">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Loading messages...
            </div>
          )}
          {!isLoading && messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          )}
          <div className="space-y-4">
            {messages.map((msg: OfferMessage) => {
              const isMe = msg.senderId === user?.id;
              const senderName = msg.senderName || (isMe ? "You" : (msg.senderId === (typeof offer.buyer === "string" ? offer.buyer : offer.buyer.id) ? buyerName : sellerName));

              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-2", isMe && "flex-row-reverse")}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn("text-xs", isMe ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      {getInitials(senderName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("flex flex-col gap-1 max-w-[75%]", isMe && "items-end")}>
                    <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{senderName}</span>
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>
                    <div className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            className="resize-none"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
