import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminList, adminUpsert } from "@/lib/admin.functions";
import { KIND_LABEL, PRODUCT_KINDS } from "@/lib/product-kinds";
import type { Product, ProductKind } from "@/types";

const FIELD =
  "w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** Lets admins rename each product and toggle its visibility on the public site. */
export function ProductNamesManager() {
  const queryClient = useQueryClient();
  const fetchList = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);

  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () =>
      fetchList({
        data: { table: "products", orderBy: "sort_order", ascending: true },
      }),
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!products.data) return;
    setDrafts(
      Object.fromEntries(
        products.data.map((row) => [
          String(row["id"]),
          String(row["display_name"] ?? ""),
        ]),
      ),
    );
  }, [products.data]);

  const save = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      upsert({ data: { table: "products", values: values as never } }),
    onSuccess: async () => {
      toast.success("Product updated. The website now shows the new name.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const rows = (products.data ?? []) as unknown as Product[];

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold">
        Products &amp; display names
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The display name is what visitors see on the website. Rename any product
        per client, or unpublish it.
      </p>

      <div className="mt-4 space-y-3">
        {rows.map((product) => (
          <div
            key={product.id}
            className="grid gap-3 rounded-xl border border-border/60 bg-surface/60 p-4 sm:grid-cols-[1fr_1.2fr_auto_auto]"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Internal name
              </p>
              <p className="mt-1 text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {KIND_LABEL[product.kind as ProductKind]}
              </p>
            </div>

            <div>
              <label
                htmlFor={`name-${product.id}`}
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Display name
              </label>
              <input
                id={`name-${product.id}`}
                className={`${FIELD} mt-1`}
                maxLength={120}
                value={drafts[product.id] ?? ""}
                onChange={(event) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [product.id]: event.target.value,
                  }))
                }
              />
            </div>

            <button
              type="button"
              disabled={save.isPending || !(drafts[product.id] ?? "").trim()}
              onClick={() =>
                save.mutate({
                  ...product,
                  display_name: (drafts[product.id] ?? "").trim(),
                })
              }
              className="self-end rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Save
            </button>

            <button
              type="button"
              disabled={save.isPending}
              onClick={() =>
                save.mutate({ ...product, is_published: !product.is_published })
              }
              className="self-end rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-primary/50"
            >
              {product.is_published ? "Unpublish" : "Publish"}
            </button>
          </div>
        ))}

        {!products.isPending && rows.length === 0 && (
          <p className="rounded-xl border border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
            No products yet.
          </p>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Available kinds:{" "}
        {PRODUCT_KINDS.map((kind) => KIND_LABEL[kind]).join(", ")}.
      </p>
    </section>
  );
}
