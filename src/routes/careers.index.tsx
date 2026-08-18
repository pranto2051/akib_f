import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MapPin } from "lucide-react";

import { EmptyState, PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard, SectionHeading } from "@/components/shared/primitives";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { careersQuery } from "@/lib/queries";

export const Route = createFileRoute("/careers/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(careersQuery),
  head: () => ({
    meta: [
      { title: "Careers — Build Operational Software With Us" },
      {
        name: "description",
        content:
          "Open engineering, design and delivery roles in Dhaka and remote. Senior-only teams, real ownership, no junior hand-offs.",
      },
      { property: "og:title", content: "Careers — KeekSurge" },
      { property: "og:description", content: "Open roles across engineering, design and delivery." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <PageHero title="No open roles" />,
  component: CareersPage,
});

const PERKS = [
  "Hybrid by default, fully remote if you deliver",
  "Annual learning budget and conference travel",
  "Private health cover for you and dependents",
  "Profit share after two years",
  "Four-day weeks between projects",
  "Real ownership of one product area",
];

function CareersPage() {
  const { data: careers } = useSuspenseQuery(careersQuery);

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero
            eyebrow="Careers"
            title="Work on software people depend on daily"
            description="Small teams, senior engineers, and clients who notice when we ship something good."
          />

          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <SectionHeading align="left" eyebrow="Open roles" title="Currently hiring" />
              <div className="mt-10 space-y-4">
                {careers.length === 0 ? (
                  <EmptyState
                    title="No open roles right now"
                    description="Send us a note anyway — we keep strong profiles on file."
                  />
                ) : (
                  careers.map((career, index) => (
                    <ScrollReveal key={career.id} delay={index * 50}>
                      <Link to="/careers/$slug" params={{ slug: career.slug }} className="block">
                        <GlassCard className="p-6">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <h2 className="text-lg font-semibold">{career.title}</h2>
                              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                  <Briefcase className="h-3.5 w-3.5" /> {career.department}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" /> {career.location}
                                </span>
                                <span>{career.type.replace("_", " ").toLowerCase()}</span>
                                <span>{career.experience}</span>
                              </div>
                            </div>
                            <span
                              className="rounded-md px-4 py-2 text-xs font-semibold text-primary-foreground"
                              style={{ backgroundImage: "var(--gradient-brand)" }}
                            >
                              View role
                            </span>
                          </div>
                        </GlassCard>
                      </Link>
                    </ScrollReveal>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="border-t border-border/60 bg-surface/30 py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <SectionHeading align="left" eyebrow="Life here" title="What you get" />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {PERKS.map((perk) => (
                  <li key={perk} className="rounded-lg border border-border/60 p-4 text-sm">
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </SiteShell>
  );
}
