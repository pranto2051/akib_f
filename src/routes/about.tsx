import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter } from "lucide-react";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { GlassCard, GradientText, SectionHeading } from "@/components/shared/primitives";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { settingsQuery, teamQuery } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(teamQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "About Us — KeekSurge" },
      {
        name: "description",
        content:
          "Founded in 2019 in Dhaka, we build hostel management and enterprise software with senior-only delivery teams.",
      },
      { property: "og:title", content: "About Us — KeekSurge" },
      {
        property: "og:description",
        content: "Our story, values and the people behind 180+ delivered projects.",
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <PageHero title="Not found" />,
  component: AboutPage,
});

const VALUES = [
  { title: "Clarity over cleverness", body: "Boring, readable systems your next engineer can maintain." },
  { title: "Own the outcome", body: "We measure success by the metric the client cares about." },
  { title: "Ship weekly", body: "Momentum beats perfect planning. Something real lands every sprint." },
  { title: "Respect operations", body: "The people using the software daily get the final say on UX." },
  { title: "Security is not a phase", body: "Access control designed on day one, audited before launch." },
  { title: "Say the hard thing", body: "If a request will hurt the product, we tell you before we build it." },
];

const MILESTONES = [
  { year: "2019", title: "Founded in Dhaka", body: "Three engineers, one hostel client, one laptop each." },
  { year: "2020", title: "First platform launch", body: "Our hostel management suite went live across 6 campuses." },
  { year: "2021", title: "Enterprise practice", body: "Added ERP, CRM and cloud engineering service lines." },
  { year: "2023", title: "Regional expansion", body: "Delivery for clients in Malaysia, UAE and Singapore." },
  { year: "2025", title: "180 projects", body: "A 42-person team with a 96% client retention rate." },
];

export function TeamGrid() {
  const { data: team } = useSuspenseQuery(teamQuery);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((member, index) => (
        <ScrollReveal key={member.id} delay={index * 50}>
          <GlassCard className="h-full p-6 text-center">
            <span
              aria-hidden
              className="mx-auto grid h-16 w-16 place-items-center rounded-full font-display text-xl font-bold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              {member.name.charAt(0)}
            </span>
            <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
            <p className="text-sm text-accent">{member.designation}</p>
            {member.bio ? (
              <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
            ) : null}
            <div className="mt-4 flex justify-center gap-2">
              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} on LinkedIn`}
                  className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {member.twitter ? (
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} on X`}
                  className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {member.github ? (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${member.name} on GitHub`}
                  className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </GlassCard>
        </ScrollReveal>
      ))}
    </div>
  );
}

function AboutPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero
            eyebrow="About us"
            title="We build the systems that keep operations running"
            description={settings?.tagline}
          />

          <section className="py-16 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
              <div>
                <h2 className="text-2xl font-bold">Our story</h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    We started in {settings?.founded_year ?? "2019"} with a single frustrated client: a
                    hostel group running 2,400 beds on spreadsheets, paper gate registers and a
                    WhatsApp group for maintenance requests. Nothing reconciled, and nobody trusted
                    the numbers.
                  </p>
                  <p>
                    We rebuilt that operation around one platform — admissions, allocation, billing,
                    attendance, mess and complaints — and watched their monthly close drop from nine
                    days to one afternoon. That project defined how we work: sit inside the
                    operation, understand the workflow, then engineer for it.
                  </p>
                  <p>
                    Today we are a {settings?.city ?? "Dhaka"}-based team delivering hostel platforms,
                    ERP systems, mobile apps and cloud infrastructure for clients across Asia and the
                    Gulf. The engineers who scope your project are the engineers who build it.
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <GlassCard hover={false} className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
                    Mission
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Give operational teams software they trust enough to stop keeping a parallel
                    spreadsheet.
                  </p>
                </GlassCard>
                <GlassCard hover={false} className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
                    Vision
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Be the region's default engineering partner for residential and institutional
                    operations.
                  </p>
                </GlassCard>
                <dl className="grid grid-cols-2 gap-5 sm:col-span-2">
                  {(settings?.stats ?? []).map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border/60 p-5">
                      <dd className="font-display text-3xl font-bold">
                        <GradientText>
                          <AnimatedCounter value={stat.value} suffix={stat.suffix ?? ""} />
                        </GradientText>
                      </dd>
                      <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section className="border-y border-border/60 bg-surface/30 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Values" title="Six rules we actually follow" />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {VALUES.map((value, index) => (
                  <ScrollReveal key={value.title} delay={index * 50}>
                    <GlassCard className="h-full p-6">
                      <h3 className="text-base font-semibold">{value.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Timeline" title="How we got here" />
              <ol className="mt-12 space-y-8 border-l border-border/60 pl-6">
                {MILESTONES.map((milestone) => (
                  <li key={milestone.year} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    />
                    <p className="font-display text-sm font-bold text-accent">{milestone.year}</p>
                    <h3 className="mt-1 text-base font-semibold">{milestone.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{milestone.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="border-t border-border/60 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Team" title="The people you'll work with" />
              <div className="mt-12">
                <TeamGrid />
              </div>
              <div className="mt-12 text-center">
                <Link
                  to="/careers"
                  className="inline-flex rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  Join the team
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </SiteShell>
  );
}
