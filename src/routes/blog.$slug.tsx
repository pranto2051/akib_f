import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard } from "@/components/shared/primitives";
import { blogPostQuery, blogQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const [post] = await Promise.all([
      context.queryClient.ensureQueryData(blogPostQuery(params.slug)),
      context.queryClient.ensureQueryData(blogQuery),
    ]);
    if (!post) throw notFound();
    return { title: post.title, description: post.excerpt };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — KeekSurge Blog` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
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
      {() => <PageHero title="Article not found" description="This post may have been unpublished." />}
    </SiteShell>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(blogPostQuery(slug));
  const { data } = useSuspenseQuery(blogQuery);
  if (!post) return null;

  const related = data.posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero eyebrow="Insight" title={post.title} description={post.excerpt} />
          <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{post.author_name}</span>
              {post.published_at ? (
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              ) : null}
              {post.reading_time ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.reading_time} min read
                </span>
              ) : null}
            </div>

            <div
              className="mt-8 h-52 w-full rounded-xl opacity-70"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            />

            <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted-foreground">
              {post.content.split("\n\n").map((block, index) =>
                block.startsWith("## ") ? (
                  <h2 key={index} className="pt-4 text-xl font-bold text-foreground">
                    {block.replace("## ", "")}
                  </h2>
                ) : (
                  <p key={index} className="whitespace-pre-line">
                    {block}
                  </p>
                ),
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {related.length > 0 ? (
            <section className="border-t border-border/60 py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-bold">Keep reading</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  {related.map((item) => (
                    <Link key={item.id} to="/blog/$slug" params={{ slug: item.slug }}>
                      <GlassCard className="h-full p-5">
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <p className="mt-2 text-xs text-muted-foreground">{item.excerpt}</p>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </SiteShell>
  );
}
