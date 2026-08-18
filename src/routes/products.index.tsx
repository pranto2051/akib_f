import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard, SectionHeading } from "@/components/shared/primitives";
import { ProductRequestModal } from "@/components/shared/ProductRequestForm";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { KIND_LABEL } from "@/lib/product-kinds";
import { productCategoriesQuery, productsQuery } from "@/lib/queries";

export const Route = createFileRoute("/products/")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(productsQuery);
    void context.queryClient.ensureQueryData(productCategoriesQuery);
  },
  head: () => ({
    meta: [
      { title: "Products — Hostel, Attendance & Biometric Systems | KeekSurge" },
      {
        name: "description",
        content:
          "KeekSurge products: Hostel Management System, fingerprint attendance devices, auto check-in terminals, website and mobile app development — white-labelled to your brand.",
      },
      { property: "og:title", content: "Products — KeekSurge" },
      {
        property: "og:description",
        content: "Software, in-house hardware and development services built by KeekSurge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <PageHero title="No products published" />,
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: categories } = useSuspenseQuery(productCategoriesQuery);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [requested, setRequested] = useState<{ id: string; name: string } | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory = activeCategory === "all" || product.category_id === activeCategory;
      const matches =
        !term ||
        product.display_name.toLowerCase().includes(term) ||
        product.tagline.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      return inCategory && matches;
    });
  }, [products, activeCategory, search]);

  const categoryName = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero
            eyebrow="Products"
            title="One parent company, a family of products"
            description="KeekSurge builds software, in-house hardware and custom development. Every product can carry your own name — we white-label the branding per organisation."
          />

          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Product categories">
                  <CategoryTab
                    label="All"
                    active={activeCategory === "all"}
                    onClick={() => setActiveCategory("all")}
                  />
                  {categories.map((category) => (
                    <CategoryTab
                      key={category.id}
                      label={category.name}
                      icon={category.icon_name}
                      active={activeCategory === category.id}
                      onClick={() => setActiveCategory(category.id)}
                    />
                  ))}
                </div>

                <div className="relative lg:w-72">
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products…"
                    aria-label="Search products"
                    className="w-full rounded-md border border-input bg-surface py-2.5 pl-9 pr-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="mt-8">
                {filtered.length === 0 ? (
                  <EmptyState
                    title="No products match"
                    description="Try another category or clear the search."
                  />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((product, index) => {
                      const Icon =
                        (Icons as unknown as Record<string, Icons.LucideIcon>)[product.icon_name] ??
                        Icons.Package;
                      return (
                        <ScrollReveal key={product.id} delay={index * 50}>
                          <GlassCard className="flex h-full flex-col p-6">
                            <div className="mb-4 flex items-center justify-between">
                              <span
                                className="grid h-10 w-10 place-items-center rounded-lg"
                                style={{ backgroundImage: "var(--gradient-brand)" }}
                              >
                                <Icon className="h-5 w-5 text-primary-foreground" />
                              </span>
                              <span className="rounded-full border border-border/70 px-2.5 py-0.5 text-xs text-muted-foreground">
                                {(product.category_id && categoryName.get(product.category_id)) ??
                                  KIND_LABEL[product.kind]}
                              </span>
                            </div>
                            <h2 className="text-lg font-semibold">
                              <Link
                                to="/products/$slug"
                                params={{ slug: product.slug }}
                                className="hover:text-accent"
                              >
                                {product.display_name}
                              </Link>
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>
                            <ul className="mt-4 space-y-1.5">
                              {product.features.slice(0, 3).map((feature) => (
                                <li key={feature} className="text-xs text-muted-foreground">
                                  • {feature}
                                </li>
                              ))}
                            </ul>

                            <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                              <Link
                                to="/products/$slug"
                                params={{ slug: product.slug }}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                              >
                                View product <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                              {product.show_request_button ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setRequested({ id: product.id, name: product.display_name })
                                  }
                                  className="ml-auto rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary/50"
                                >
                                  Request this
                                </button>
                              ) : null}
                            </div>
                          </GlassCard>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="border-t border-border/60 py-16">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="White labelling"
                title="Want the product under your own name?"
                description="Every product name shown here is configurable. Tell us your brand and we ship the device, the app and the dashboard under it."
              />
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <ProductRequestModal
            productId={requested?.id ?? ""}
            productName={requested?.name ?? ""}
            open={requested !== null}
            onClose={() => setRequested(null)}
          />
        </>
      )}
    </SiteShell>
  );
}

function CategoryTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: string | null;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = icon ? ((Icons as unknown as Record<string, Icons.LucideIcon>)[icon] ?? null) : null;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-transparent text-primary-foreground"
          : "border-border/70 text-muted-foreground hover:border-primary/50 hover:text-foreground"
      }`}
      style={active ? { backgroundImage: "var(--gradient-brand)" } : undefined}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {label}
    </button>
  );
}
