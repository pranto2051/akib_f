import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeVars } from "@/components/layout/ThemeVars";
import { settingsQuery } from "@/lib/queries";
import type { SiteSettings } from "@/types";

/** Wraps every public page with header, footer and the admin-driven theme. */
export function SiteShell({
  children,
}: {
  children: (settings: SiteSettings | null) => ReactNode;
}) {
  const { data: settings } = useQuery(settingsQuery);

  if (settings?.maintenance_mode) {
    return (
      <>
        <ThemeVars settings={settings} />
        <main className="grid min-h-screen place-items-center px-4 text-center">
          <div>
            <h1 className="text-3xl font-bold">{settings.site_name}</h1>
            <p className="mt-3 text-muted-foreground">
              {settings.maintenance_message}
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <ThemeVars settings={settings} />
      <div className="flex min-h-screen flex-col">
        <Header settings={settings} />
        <main className="flex-1">{children(settings ?? null)}</main>
        <Footer settings={settings} />
      </div>
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--gradient-subtle)" }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-balance text-4xl font-bold sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string | undefined;
}) {
  return (
    <div className="glass-card rounded-xl px-6 py-16 text-center">
      <div
        aria-hidden
        className="mx-auto mb-4 h-12 w-12 rounded-full opacity-70"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass-card h-52 animate-pulse rounded-xl" />
      ))}
    </div>
  );
}
