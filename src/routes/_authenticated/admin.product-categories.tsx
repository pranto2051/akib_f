import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { GradientText } from "@/components/shared/primitives";
import { adminDelete, adminList, adminUpsert, logActivity } from "@/lib/admin.functions";
import type { ProductCategory } from "@/types";

export const Route = createFileRoute("/_authenticated/admin/product-categories")({
  component: CategoriesManager,
});

const FIELD =
  "w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const EMPTY: Partial<ProductCategory> = {
  name: "",
  slug: "",
  icon_name: "Layers",
  description: "",
  sort_order: 0,
};

function CategoriesManager() {
  const queryClient = useQueryClient();
  const fetchList = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const remove = useServerFn(adminDelete);
  const log = useServerFn(logActivity);

  const categories = useQuery({
    queryKey: ["admin", "product-categories"],
    queryFn: () => fetchList({ data: { table: "product_categories", orderBy: "sort_order" } }),
  });
  const rows = (categories.data ?? []) as unknown as ProductCategory[];
  const [draft, setDraft] = useState<Partial<ProductCategory> | null>(null);

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
    mutationFn: async (values: Partial<ProductCategory>) => {
      await upsert({ data: { table: "product_categories", values: values as never } });
      await log({
        data: {
          action: values.id ? "category.updated" : "category.created",
          entity_type: "product_category",
          ...(values.id ? { entity_id: values.id } : {}),
          detail: { name: values.name ?? "" },
        },
      });
    },
    onSuccess: async () => {
      toast.success("Category saved");
      setDraft(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "product-categories"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const del = useMutation({
    mutationFn: (category: ProductCategory) =>
      remove({ data: { table: "product_categories", id: category.id } }),
    onSuccess: async () => {
      toast.success("Category deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin", "product-categories"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function update<K extends keyof ProductCategory>(key: K, value: ProductCategory[K]) {
    setDraft((current) => ({ ...(current ?? EMPTY), [key]: value }));
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            <GradientText>Product categories</GradientText>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Categories power the filters on the public catalogue.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDraft({ ...EMPTY, sort_order: rows.length })}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          <Plus className="h-4 w-4" /> New category
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{row.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.sort_order}</td>
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
                      aria-label={`Delete ${row.name}`}
                      onClick={() => {
                        if (confirm(`Delete “${row.name}”?`)) del.mutate(row);
                      }}
                      className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!categories.isPending && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No categories yet.
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
            aria-label={draft.id ? "Edit category" : "New category"}
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate(draft);
            }}
            className="relative z-10 my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
              <h2 className="font-display text-xl font-semibold">
                {draft.id ? "Edit category" : "New category"}
              </h2>
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
          <label className="text-xs uppercase tracking-wider text-muted-foreground">

            Name
            <input
              className={`${FIELD} mt-1.5`}
              required
              value={draft.name ?? ""}
              onChange={(event) => update("name", event.target.value)}
            />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Slug
            <input
              className={`${FIELD} mt-1.5`}
              required
              value={draft.slug ?? ""}
              onChange={(event) => update("slug", event.target.value)}
            />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Icon name (lucide)
            <input
              className={`${FIELD} mt-1.5`}
              value={draft.icon_name ?? ""}
              onChange={(event) => update("icon_name", event.target.value || null)}
            />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Sort order
            <input
              type="number"
              className={`${FIELD} mt-1.5`}
              value={draft.sort_order ?? 0}
              onChange={(event) => update("sort_order", Number(event.target.value))}
            />
          </label>
          <label className="text-xs uppercase tracking-wider text-muted-foreground sm:col-span-2">
            Description
            <textarea
              rows={3}
              className={`${FIELD} mt-1.5 resize-y`}
              value={draft.description ?? ""}
              onChange={(event) => update("description", event.target.value || null)}
            />
          </label>
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
                {save.isPending ? "Saving…" : "Save category"}
              </button>
            </footer>
          </form>
        </div>
      ) : null}

    </>
  );
}
