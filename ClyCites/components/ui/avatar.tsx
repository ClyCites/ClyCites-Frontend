"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const avatarGroupVariants = cva("flex items-center", {
  variants: {
    size: {
      default: "-space-x-2",
      sm: "-space-x-1.5",
      lg: "-space-x-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  limit?: number
  total?: number
  truncate?: boolean
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, size, limit = 4, total, truncate = true, ...props }, ref) => {
    const slicedChildren = React.Children.toArray(props.children).slice(0, limit)
    const excess = total ?? React.Children.count(props.children) - limit

    return (
      <div ref={ref} className={cn(avatarGroupVariants({ size }), className)} {...props}>
        {slicedChildren}
        {truncate && excess > 0 && (
          <Avatar>
            <AvatarFallback className="bg-muted text-muted-foreground">+{excess}</AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  },
)
AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
