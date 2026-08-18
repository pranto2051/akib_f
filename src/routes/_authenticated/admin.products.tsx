import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Star, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { GradientText } from "@/components/shared/primitives";
import { adminDelete, adminList, adminUpsert, logActivity } from "@/lib/admin.functions";
import type { HardwareSpec, Product, ProductCategory, ProductKind } from "@/types";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsManager,
});

const KINDS: ProductKind[] = ["SOFTWARE", "HARDWARE", "MOBILE_APP", "WEB_APP"];

const FIELD =
  "w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const EMPTY: Partial<Product> = {
  name: "",
  display_name: "",
  slug: "",
  kind: "SOFTWARE",
  tagline: "",
  description: "",
  icon_name: "Package",
  image_url: null,
  features: [],
  benefits: [],
  gallery_images: [],
  hardware_specs: [],
  product_url: null,
  price_note: null,
  category_id: null,
  is_featured: false,
  is_published: true,
  show_request_button: true,
  sort_order: 0,
  meta_title: null,
  meta_desc: null,
};

const toLines = (values: string[] | undefined) => (values ?? []).join("\n");
const fromLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
const specsToText = (specs: HardwareSpec[] | undefined) =>
  (specs ?? []).map((spec) => `${spec.label}: ${spec.value}`).join("\n");
const textToSpecs = (value: string): HardwareSpec[] =>
  fromLines(value).map((line) => {
    const index = line.indexOf(":");
    return index === -1
      ? { label: line, value: "" }
      : { label: line.slice(0, index).trim(), value: line.slice(index + 1).trim() };
  });

function ProductsManager() {
  const queryClient = useQueryClient();
  const fetchList = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const remove = useServerFn(adminDelete);
  const log = useServerFn(logActivity);

  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => fetchList({ data: { table: "products", orderBy: "sort_order" } }),
  });
  const categories = useQuery({
    queryKey: ["admin", "product-categories"],
    queryFn: () => fetchList({ data: { table: "product_categories", orderBy: "sort_order" } }),
  });

  const rows = (products.data ?? []) as unknown as Product[];
  const categoryRows = (categories.data ?? []) as unknown as ProductCategory[];
  const categoryName = new Map(categoryRows.map((row) => [row.id, row.name]));

  const [draft, setDraft] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    if (!draft) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDraft(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [draft]);


  const save = useMutation({
    mutationFn: async (values: Partial<Product>) => {
      const saved = await upsert({ data: { table: "products", values: values as never } });
      await log({
        data: {
          action: values.id ? "product.updated" : "product.created",
          entity_type: "product",
          ...(values.id ? { entity_id: values.id } : {}),
          detail: { display_name: values.display_name ?? "" },
        },
      });
      return saved;
    },
    onSuccess: async () => {
      toast.success("Product saved");
      setDraft(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "activity"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const del = useMutation({
    mutationFn: async (product: Product) => {
      await remove({ data: { table: "products", id: product.id } });
      await log({
        data: {
          action: "product.deleted",
          entity_type: "product",
          entity_id: product.id,
          detail: { display_name: product.display_name },
        },
      });
    },
    onSuccess: async () => {
      toast.success("Product deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((current) => ({ ...(current ?? EMPTY), [key]: value }));
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            <GradientText>Products</GradientText>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Display names shown on the public site are editable here.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDraft({ ...EMPTY, sort_order: rows.length })}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Display name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 lg:table-cell">Kind</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">
                  <span className="flex items-center gap-2">
                    {row.is_featured ? <Star className="h-3.5 w-3.5 text-accent" /> : null}
                    {row.display_name}
                  </span>
                  <span className="text-xs text-muted-foreground">/{row.slug}</span>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {row.category_id ? (categoryName.get(row.category_id) ?? "—") : "—"}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{row.kind}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => save.mutate({ ...row, is_published: !row.is_published })}
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      row.is_published
                        ? "border-emerald-500/50 text-emerald-500"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {row.is_published ? "Live" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDraft(row)}
                      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:border-primary/50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${row.display_name}`}
                      onClick={() => {
                        if (confirm(`Delete “${row.display_name}”?`)) del.mutate(row);
                      }}
                      className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!products.isPending && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {draft ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setDraft(null)}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm"
          />
          <form
            role="dialog"
            aria-modal="true"
            aria-label={draft.id ? "Edit product" : "New product"}
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate(draft);
            }}
            className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {draft.id ? "Edit product" : "New product"}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {draft.id
                    ? "Update the public details for this product."
                    : "Add a new product to the KeekSurge catalogue."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Close"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="grid max-h-[65vh] gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">


          <Text label="Internal name" value={draft.name ?? ""} onChange={(v) => update("name", v)} required />
          <Text
            label="Display name (public)"
            value={draft.display_name ?? ""}
            onChange={(v) => update("display_name", v)}
            required
          />
          <Text label="Slug" value={draft.slug ?? ""} onChange={(v) => update("slug", v)} required />
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Kind
            <select
              className={`${FIELD} mt-1.5`}
              value={draft.kind ?? "SOFTWARE"}
              onChange={(event) => update("kind", event.target.value as ProductKind)}
            >
              {KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Category
            <select
              className={`${FIELD} mt-1.5`}
              value={draft.category_id ?? ""}
              onChange={(event) => update("category_id", event.target.value || null)}
            >
              <option value="">Uncategorised</option>
              {categoryRows.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <Text label="Icon name (lucide)" value={draft.icon_name ?? ""} onChange={(v) => update("icon_name", v)} />
          <Text label="Tagline" value={draft.tagline ?? ""} onChange={(v) => update("tagline", v)} required />
          <Text
            label="Price note"
            value={draft.price_note ?? ""}
            onChange={(v) => update("price_note", v || null)}
          />
          <Text
            label="Cover image URL"
            value={draft.image_url ?? ""}
            onChange={(v) => update("image_url", v || null)}
          />
          <Text
            label="Product URL"
            value={draft.product_url ?? ""}
            onChange={(v) => update("product_url", v || null)}
          />

          <Area
            className="sm:col-span-2"
            label="Description"
            value={draft.description ?? ""}
            onChange={(v) => update("description", v)}
            rows={4}
          />
          <Area
            label="Features (one per line)"
            value={toLines(draft.features)}
            onChange={(v) => update("features", fromLines(v))}
            rows={5}
          />
          <Area
            label="Benefits (one per line)"
            value={toLines(draft.benefits)}
            onChange={(v) => update("benefits", fromLines(v))}
            rows={5}
          />
          <Area
            label="Specs (Label: Value per line)"
            value={specsToText(draft.hardware_specs)}
            onChange={(v) => update("hardware_specs", textToSpecs(v))}
            rows={5}
          />
          <Area
            label="Gallery image URLs (one per line)"
            value={toLines(draft.gallery_images)}
            onChange={(v) => update("gallery_images", fromLines(v))}
            rows={5}
          />
          <Text
            label="Meta title"
            value={draft.meta_title ?? ""}
            onChange={(v) => update("meta_title", v || null)}
          />
          <Text
            label="Meta description"
            value={draft.meta_desc ?? ""}
            onChange={(v) => update("meta_desc", v || null)}
          />

          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <Toggle
              label="Featured"
              checked={draft.is_featured ?? false}
              onChange={(v) => update("is_featured", v)}
            />
            <Toggle
              label="Published"
              checked={draft.is_published ?? true}
              onChange={(v) => update("is_published", v)}
            />
            <Toggle
              label="Show request button"
              checked={draft.show_request_button ?? true}
              onChange={(v) => update("show_request_button", v)}
            />
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Sort order
              <input
                type="number"
                className={`${FIELD} mt-1.5 w-24`}
                value={draft.sort_order ?? 0}
                onChange={(event) => update("sort_order", Number(event.target.value))}
              />
            </label>
            </div>
            </div>

            <footer className="flex flex-wrap justify-end gap-3 border-t border-border/60 bg-surface-2/40 px-6 py-4">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={save.isPending}
                className="rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                {save.isPending ? "Saving…" : "Save product"}
              </button>
            </footer>
          </form>
        </div>
      ) : null}

    </>
  );
}

function Text({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="text-xs uppercase tracking-wider text-muted-foreground">
      {label}
      <input
        className={`${FIELD} mt-1.5`}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={`text-xs uppercase tracking-wider text-muted-foreground ${className}`}>
      {label}
      <textarea
        rows={rows}
        className={`${FIELD} mt-1.5 resize-y`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
