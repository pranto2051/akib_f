import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard } from "@/components/shared/primitives";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { serviceQuery } from "@/lib/queries";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    const service = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
    if (!service) throw notFound();
    return { title: service.title, description: service.short_desc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — KeekSurge` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.title} — KeekSurge` },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <SiteShell>
      {() => (
        <PageHero
          title="Service not found"
          description="This service may have been renamed or unpublished."
        />
      )}
    </SiteShell>
  ),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { data: service } = useSuspenseQuery(serviceQuery(slug));
  if (!service) return null;

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero eyebrow="Service" title={service.title} description={service.short_desc} />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
              <div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {service.long_desc}
                </p>

                <h2 className="mt-12 text-xl font-bold">What's included</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="mt-12 text-xl font-bold">Business outcomes</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {service.faqs.length > 0 ? (
                  <>
                    <h2 className="mt-12 text-xl font-bold">Questions about this service</h2>
                    <div className="mt-5 divide-y divide-border/60 rounded-xl border border-border/60">
                      {service.faqs.map((faq) => (
                        <details key={faq.question} className="px-5 py-4">
                          <summary className="cursor-pointer list-none text-sm font-semibold">
                            {faq.question}
                          </summary>
                          <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <aside className="space-y-6">
                <ScrollReveal>
                  <GlassCard hover={false} className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
                      Technology
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </ScrollReveal>

                {service.pricing_overview ? (
                  <GlassCard hover={false} className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
                      Engagement
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">{service.pricing_overview}</p>
                  </GlassCard>
                ) : null}

                <GlassCard hover={false} className="p-6">
                  <h3 className="text-base font-semibold">Start with discovery</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    One week, fixed fee, written architecture plan you keep either way.
                  </p>
                  <Link
                    to="/contact"
                    className="mt-4 inline-flex w-full justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    Request a quote
                  </Link>
                </GlassCard>
              </aside>
            </div>
          </div>
        </>
      )}
    </SiteShell>
  );
}
