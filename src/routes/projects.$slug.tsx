import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ExternalLink, Github } from "lucide-react";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard } from "@/components/shared/primitives";
import { projectQuery } from "@/lib/queries";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    return { title: project.title, description: project.short_desc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Case Study` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.title} — Case Study` },
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
      {() => <PageHero title="Case study not found" description="This project is no longer published." />}
    </SiteShell>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQuery(slug));
  if (!project) return null;

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero eyebrow={project.category} title={project.title} description={project.short_desc} />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>

            <div
              className="mt-8 h-56 w-full rounded-xl opacity-70 sm:h-72"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            />

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
              <div>
                <h2 className="text-xl font-bold">The engagement</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {project.long_desc}
                </p>

                <h2 className="mt-12 text-xl font-bold">What we built</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="space-y-6">
                <GlassCard hover={false} className="p-6">
                  <dl className="space-y-4 text-sm">
                    {project.client_name ? (
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                          Client
                        </dt>
                        <dd className="mt-1 font-medium">{project.client_name}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Category
                      </dt>
                      <dd className="mt-1 font-medium">{project.category}</dd>
                    </div>
                    {project.completed_at ? (
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                          Completed
                        </dt>
                        <dd className="mt-1 font-medium">
                          {new Date(project.completed_at).toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Stack
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-col gap-2">
                    {project.project_url ? (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:border-primary/50"
                      >
                        Live site <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                    {project.github_url ? (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:border-primary/50"
                      >
                        Repository <Github className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </GlassCard>

                <GlassCard hover={false} className="p-6">
                  <h3 className="text-base font-semibold">Similar problem?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We can usually tell you in one call whether this approach fits your operation.
                  </p>
                  <Link
                    to="/contact"
                    className="mt-4 inline-flex w-full justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    Book a call
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
