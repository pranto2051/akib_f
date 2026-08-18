import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import { EmptyState, PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard } from "@/components/shared/primitives";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { blogQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search['q'] === "string" ? (search['q'] as string) : "",
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(blogQuery),
  head: () => ({
    meta: [
      { title: "Insights & Engineering Blog — KeekSurge" },
      {
        name: "description",
        content:
          "Practical writing on hostel operations, software architecture, cloud costs and building systems teams trust.",
      },
      { property: "og:title", content: "Insights — KeekSurge" },
      {
        property: "og:description",
        content: "Engineering and operations writing from our delivery team.",
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <PageHero title="No posts published" />,
  component: BlogPage,
});

function BlogPage() {
  const { data } = useSuspenseQuery(blogQuery);
  const posts = data.posts;
  const { q } = Route.useSearch();
  const navigate = useNavigate();

  const term = q.trim().toLowerCase();
  const visible = term
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    : posts;

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero
            eyebrow="Insights"
            title="Notes from the delivery floor"
            description="What we learn shipping operational software — written for the people who run it."
          />
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <input
                id="blog-search"
                type="search"
                value={q}
                onChange={(event) => navigate({ to: "/blog", search: { q: event.target.value } })}
                placeholder="Search articles, topics or tags"
                className="w-full max-w-md rounded-md border border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              />

              <div className="mt-10">
                {visible.length === 0 ? (
                  <EmptyState
                    title="No articles matched"
                    description="Try a different keyword or clear the search."
                  />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((post, index) => (
                      <ScrollReveal key={post.id} delay={index * 50}>
                        <Link to="/blog/$slug" params={{ slug: post.slug }} className="block h-full">
                          <GlassCard className="h-full overflow-hidden">
                            <div
                              className="h-36 w-full opacity-70"
                              style={{ backgroundImage: "var(--gradient-brand)" }}
                            />
                            <div className="p-6">
                              <div className="flex flex-wrap gap-1.5">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <h2 className="mt-3 text-lg font-semibold">{post.title}</h2>
                              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{post.author_name}</span>
                                {post.published_at ? (
                                  <span>
                                    {new Date(post.published_at).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                ) : null}
                                {post.reading_time ? (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {post.reading_time} min
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </GlassCard>
                        </Link>
                      </ScrollReveal>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </SiteShell>
  );
}
