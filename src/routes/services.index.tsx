import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";

import { EmptyState, PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard, SectionHeading } from "@/components/shared/primitives";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { servicesQuery } from "@/lib/queries";

export const Route = createFileRoute("/services/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  head: () => ({
    meta: [
      { title: "Services — Software Engineering & Hostel Platforms" },
      {
        name: "description",
        content:
          "Hostel management systems, custom software, web and mobile apps, ERP/CRM, cloud, IoT and AI integration delivered by senior engineers.",
      },
      { property: "og:title", content: "Services — KeekSurge" },
      {
        property: "og:description",
        content: "Eight service lines covering the full product lifecycle.",
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <PageHero title="No services published" />,
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useSuspenseQuery(servicesQuery);

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero
            eyebrow="Services"
            title="Engineering for operations that cannot go down"
            description="From a single hostel platform to a multi-country ERP rollout — scoped in a week, delivered in sprints, owned by you."
          />
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {services.length === 0 ? (
                <EmptyState title="Nothing published yet" description="Services will appear here soon." />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service, index) => {
                    const Icon =
                      (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon_name] ??
                      Icons.Sparkles;
                    return (
                      <ScrollReveal key={service.id} delay={index * 50}>
                        <Link
                          to="/services/$slug"
                          params={{ slug: service.slug }}
                          className="block h-full"
                        >
                          <GlassCard className="h-full p-6">
                            <span
                              className="mb-4 grid h-10 w-10 place-items-center rounded-lg"
                              style={{ backgroundImage: "var(--gradient-brand)" }}
                            >
                              <Icon className="h-5 w-5 text-primary-foreground" />
                            </span>
                            <h2 className="text-lg font-semibold">{service.title}</h2>
                            <p className="mt-2 text-sm text-muted-foreground">{service.short_desc}</p>
                            <ul className="mt-4 space-y-1.5">
                              {service.features.slice(0, 3).map((feature) => (
                                <li key={feature} className="text-xs text-muted-foreground">
                                  • {feature}
                                </li>
                              ))}
                            </ul>
                            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                              View details <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </GlassCard>
                        </Link>
                      </ScrollReveal>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="border-t border-border/60 py-16">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Next step"
                title="Not sure which of these you need?"
                description="Book a discovery call. We map your workflow first and recommend the smallest thing that fixes it."
              />
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Talk to an engineer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </>
      )}
    </SiteShell>
  );
}
