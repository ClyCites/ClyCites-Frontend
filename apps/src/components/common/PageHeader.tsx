"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { slideUp } from "@/lib/motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, className }: PageHeaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.header
      variants={slideUp(Boolean(reducedMotion), 10)}
      initial="hidden"
      animate="show"
      className={cn("rounded-[var(--radius-xl)] border border-border/60 bg-card/82 px-6 py-5 shadow-sm backdrop-blur-sm", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1.5">
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="transition-colors hover:text-foreground">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-foreground" : undefined}>{crumb.label}</span>
                    )}
                    {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                  </span>
                );
              })}
            </nav>
          )}
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="max-w-3xl text-sm text-muted-foreground sm:text-[0.95rem]">{subtitle}</p>}
        </div>

        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </motion.header>
  );
}
