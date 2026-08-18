import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard } from "@/components/shared/primitives";
import { ProductRequestModal } from "@/components/shared/ProductRequestForm";
import { KIND_LABEL } from "@/lib/product-kinds";
import { productDetailQuery } from "@/lib/queries";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.ensureQueryData(productDetailQuery(params.slug));
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — KeekSurge" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = product.meta_title ?? `${product.display_name} — KeekSurge`;
    const description = product.meta_desc ?? product.tagline;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(product.image_url?.startsWith("https://")
          ? [
              { property: "og:image", content: product.image_url },
              { name: "twitter:image", content: product.image_url },
            ]
          : []),
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <PageHero title="Product not found" />,
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: detail } = useSuspenseQuery(productDetailQuery(slug));
  const [requestOpen, setRequestOpen] = useState(false);

  if (!detail) return <PageHero title="Product not found" />;

  const { product, related, faqs, category } = detail;
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[product.icon_name] ?? Icons.Package;

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero
            eyebrow={category?.name ?? KIND_LABEL[product.kind]}
            title={product.display_name}
            description={product.tagline}
          />

          <section className="py-16 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
              <div>
                <span
                  className="mb-6 grid h-12 w-12 place-items-center rounded-xl"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </span>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>

                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.display_name}
                    loading="lazy"
                    className="mt-8 w-full rounded-xl border border-border/60"
                  />
                ) : null}

                {product.features.length > 0 ? (
                  <>
                    <h2 className="mt-10 text-xl font-semibold">What you get</h2>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {product.benefits.length > 0 ? (
                  <>
                    <h2 className="mt-10 text-xl font-semibold">Why teams choose it</h2>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {product.benefits.map((benefit) => (
                        <li key={benefit} className="flex gap-2.5 text-sm text-muted-foreground">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {product.hardware_specs.length > 0 ? (
                  <>
                    <h2 className="mt-10 text-xl font-semibold">Technical specifications</h2>
                    <div className="mt-4 overflow-hidden rounded-xl border border-border/60">
                      <table className="w-full text-left text-sm">
                        <tbody>
                          {product.hardware_specs.map((spec) => (
                            <tr key={spec.label} className="border-b border-border/60 last:border-0">
                              <th scope="row" className="w-40 bg-surface/60 px-4 py-3 font-medium">
                                {spec.label}
                              </th>
                              <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}

                {product.gallery_images.length > 0 ? (
                  <>
                    <h2 className="mt-10 text-xl font-semibold">Gallery</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {product.gallery_images.map((image) => (
                        <img
                          key={image}
                          src={image}
                          alt={`${product.display_name} preview`}
                          loading="lazy"
                          className="w-full rounded-xl border border-border/60"
                        />
                      ))}
                    </div>
                  </>
                ) : null}

                {faqs.length > 0 ? (
                  <>
                    <h2 className="mt-10 text-xl font-semibold">Questions about {product.display_name}</h2>
                    <dl className="mt-4 space-y-4">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="rounded-xl border border-border/60 p-4">
                          <dt className="text-sm font-semibold">{faq.question}</dt>
                          <dd className="mt-2 text-sm text-muted-foreground">{faq.answer}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : null}
              </div>

              <aside>
                <GlassCard className="p-6" hover={false}>
                  <h2 className="text-base font-semibold">Interested in {product.display_name}?</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We can deploy it under your own brand name and adapt it to your workflow.
                  </p>
                  {product.price_note ? (
                    <p className="mt-4 rounded-lg border border-border/60 bg-surface/60 px-3 py-2 text-xs text-muted-foreground">
                      {product.price_note}
                    </p>
                  ) : null}

                  {product.show_request_button ? (
                    <button
                      type="button"
                      onClick={() => setRequestOpen(true)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    >
                      Request this product <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : null}

                  <Link
                    to="/contact"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:border-primary/50"
                  >
                    Talk to us
                  </Link>
                  {product.product_url ? (
                    <a
                      href={product.product_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:border-primary/50"
                    >
                      Visit product site
                    </a>
                  ) : null}
                  <Link
                    to="/products"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:border-primary/50"
                  >
                    All products
                  </Link>
                </GlassCard>

                {related.length > 0 ? (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Related products
                    </h2>
                    <div className="mt-3 space-y-3">
                      {related.map((item) => (
                        <Link
                          key={item.id}
                          to="/products/$slug"
                          params={{ slug: item.slug }}
                          className="block rounded-xl border border-border/60 p-4 transition-colors hover:border-primary/50"
                        >
                          <p className="text-sm font-medium">{item.display_name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.tagline}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </section>

          <ProductRequestModal
            productId={product.id}
            productName={product.display_name}
            open={requestOpen}
            onClose={() => setRequestOpen(false)}
          />
        </>
      )}
    </SiteShell>
  );
}
