import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("text-gradient", className)}>{children}</span>;
}

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
    </div>
  );
}

export function GridPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]",
        className,
      )}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  description?: string | undefined;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl font-bold sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-pretty text-base text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
