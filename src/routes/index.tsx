import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowRight, Check, Quote, Star } from "lucide-react";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import {
  FloatingOrbs,
  GlassCard,
  GradientText,
  GridPattern,
  SectionHeading,
} from "@/components/shared/primitives";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import {
  faqsQuery,
  projectsQuery,
  servicesQuery,
  settingsQuery,
  testimonialsQuery,
} from "@/lib/queries";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
      context.queryClient.ensureQueryData(faqsQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "KeekSurge — Software, Hardware & Mobile Solutions for Modern Businesses" },
      {
        name: "description",
        content:
          "We build hostel management platforms, enterprise software and custom business systems from Dhaka. 180+ projects delivered since 2019.",
      },
      { property: "og:title", content: "KeekSurge — Software, Hardware & Mobile Solutions" },
      {
        property: "og:description",
        content: "Hostel management platforms, enterprise software and custom systems that scale.",
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="grid min-h-screen place-items-center px-4 text-center">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <PageHero title="Nothing here yet" />,
  component: HomePage,
});

const WHY_US = [
  { title: "Senior-only delivery teams", body: "No junior hand-offs. The people who scope your project build it." },
  { title: "Fixed scope after discovery", body: "One paid discovery week, then a price and date we hold ourselves to." },
  { title: "You own the code", body: "Every repository transfers to your organisation at handover." },
  { title: "Security by default", body: "Row-level access control and audited admin actions on every project." },
  { title: "Operations-first design", body: "We design for people who use the software eight hours a day." },
  { title: "Support that answers", body: "Named engineers on a shared channel, not a ticket queue." },
];

const PROCESS = [
  { step: "01", title: "Discovery", body: "One week of interviews, process mapping and a written architecture plan." },
  { step: "02", title: "Design", body: "Clickable prototypes for the screens your team lives in." },
  { step: "03", title: "Build", body: "Two-week sprints with a working deployment at the end of each one." },
  { step: "04", title: "Integrate", body: "Devices, payment rails and the systems you already run." },
  { step: "05", title: "Launch", body: "Data migration, staff training and a supported go-live week." },
  { step: "06", title: "Improve", body: "A monthly retainer that keeps shipping after launch." },
];

function ServiceIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <Icon className="h-5 w-5 text-primary-foreground" />;
}

function HomePage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: faqs } = useSuspenseQuery(faqsQuery);

  const featured = projects.filter((project) => project.is_featured).slice(0, 3);
  const stats = settings?.stats ?? [];

  return (
    <SiteShell>
      {() => (
        <>
          {/* HERO */}
          <section className="relative overflow-hidden py-20 sm:py-28">
            <FloatingOrbs />
            <GridPattern />
            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <div>

                <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {settings?.hero_eyebrow}
                </p>
                <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] sm:text-6xl">
                  <GradientText>{settings?.hero_headline}</GradientText>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
                  {settings?.hero_subheadline}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a
                    href={settings?.hero_cta_primary_url ?? "/contact"}
                    className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    {settings?.hero_cta_primary_text} <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={settings?.hero_cta_secondary_url ?? "/projects"}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50"
                  >
                    {settings?.hero_cta_secondary_text}
                  </a>
                </div>
                <dl className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4">
                  {stats.slice(0, 3).map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </dt>
                      <dd className="font-display text-2xl font-bold">
                        {stat.value}
                        {stat.suffix}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* TRUSTED BY */}
          <section className="border-y border-border/60 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Trusted by teams across Asia
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {(settings?.trusted_by_logos ?? []).map((logo) => (
                  <span key={logo.name} className="font-display text-lg font-semibold text-muted-foreground/70">
                    {logo.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="What we do"
                title={<>Engineering across the whole stack</>}
                description="Eight service lines, one delivery team, and a bias toward systems that keep working after we leave."
              />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => (
                  <ScrollReveal key={service.id} delay={index * 60}>
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
                          <ServiceIcon name={service.icon_name} />
                        </span>
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{service.short_desc}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                          Learn more <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section className="border-y border-border/60 bg-surface/30 py-20 sm:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
              <SectionHeading
                align="left"
                eyebrow="Why us"
                title="A delivery partner, not a vendor"
                description="We have shipped 180 projects since 2019. These are the commitments that made clients stay."
              />
              <ul className="grid gap-5 sm:grid-cols-2">
                {WHY_US.map((item, index) => (
                  <ScrollReveal key={item.title} delay={index * 50}>
                    <li className="flex gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <div>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                      </div>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
            </div>
          </section>

          {/* FEATURED PROJECTS */}
          <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Case studies" title="Recent work" />
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {featured.map((project, index) => (
                  <ScrollReveal key={project.id} delay={index * 70}>
                    <Link to="/projects/$slug" params={{ slug: project.slug }} className="block h-full">
                      <GlassCard className="h-full overflow-hidden">
                        <div
                          className="h-40 w-full opacity-70"
                          style={{ backgroundImage: "var(--gradient-brand)" }}
                        />
                        <div className="p-6">
                          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            {project.category}
                          </span>
                          <h3 className="mt-3 text-lg font-semibold">{project.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">{project.short_desc}</p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.tech_stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:border-primary/50"
                >
                  View all projects <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* PROCESS */}
          <section className="border-y border-border/60 bg-surface/30 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="How we work" title="Six steps, no surprises" />
              <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {PROCESS.map((phase, index) => (
                  <ScrollReveal key={phase.step} delay={index * 60}>
                    <li className="relative rounded-xl border border-border/60 bg-surface/50 p-6">
                      <span className="font-display text-3xl font-bold text-gradient">{phase.step}</span>
                      <h3 className="mt-2 text-base font-semibold">{phase.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{phase.body}</p>
                    </li>
                  </ScrollReveal>
                ))}
              </ol>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Clients" title="What they say afterwards" />
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {testimonials.slice(0, 6).map((item, index) => (
                  <ScrollReveal key={item.id} delay={index * 60}>
                    <GlassCard className="h-full p-6">
                      <Quote className="h-6 w-6 text-accent" />
                      <p className="mt-4 text-sm leading-relaxed">{item.review}</p>
                      <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                        <span
                          aria-hidden
                          className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-primary-foreground"
                          style={{ backgroundImage: "var(--gradient-brand)" }}
                        >
                          {item.name.charAt(0)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.designation}, {item.company}
                          </p>
                        </div>
                        <span className="ml-auto flex gap-0.5" aria-label={`${item.rating} out of 5`}>
                          {Array.from({ length: item.rating }).map((_, starIndex) => (
                            <Star key={starIndex} className="h-3.5 w-3.5 fill-accent text-accent" />
                          ))}
                        </span>
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="border-y border-border/60 py-16">
            <dl className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dd className="font-display text-4xl font-extrabold">
                    <GradientText>
                      <AnimatedCounter value={stat.value} suffix={stat.suffix ?? ""} />
                    </GradientText>
                  </dd>
                  <dt className="mt-2 text-sm text-muted-foreground">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          {/* FAQ */}
          <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="FAQ" title="Questions we get every week" />
              <div className="mt-10 divide-y divide-border/60 rounded-xl border border-border/60">
                {faqs.slice(0, 8).map((faq) => (
                  <details key={faq.id} className="group px-5 py-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative overflow-hidden border-t border-border/60 py-20">
            <FloatingOrbs />
            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="text-balance text-3xl font-bold sm:text-4xl">
                Ready to replace the spreadsheets?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tell us what your operation looks like today. We will tell you honestly whether we are
                the right team for it.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02]"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </>
      )}
    </SiteShell>
  );
}
