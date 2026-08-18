import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, MessageCircle, Phone, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { GradientText } from "@/components/shared/primitives";
import { adminList, adminUpsert, leadStats, logActivity } from "@/lib/admin.functions";
import type { Product, ProductRequest, RequestStatus } from "@/types";

export const Route = createFileRoute("/_authenticated/admin/requests")({
  component: RequestsManager,
});

const STATUSES: RequestStatus[] = ["NEW", "CONTACTED", "INTERESTED", "CONVERTED", "LOST"];

const STATUS_CLASS: Record<RequestStatus, string> = {
  NEW: "border-primary/50 text-primary",
  CONTACTED: "border-accent/50 text-accent",
  INTERESTED: "border-accent/60 text-accent",
  CONVERTED: "border-emerald-500/50 text-emerald-500",
  LOST: "border-destructive/50 text-destructive",
};

const FIELD =
  "rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function RequestsManager() {
  const queryClient = useQueryClient();
  const fetchList = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const log = useServerFn(logActivity);
  const fetchLeads = useServerFn(leadStats);

  const requests = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: () =>
      fetchList({
        data: { table: "product_requests", orderBy: "created_at", ascending: false, limit: 500 },
      }),
  });
  const products = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => fetchList({ data: { table: "products", orderBy: "sort_order" } }),
  });
  const staff = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: () => fetchList({ data: { table: "profiles", orderBy: "name" } }),
  });
  const stats = useQuery({ queryKey: ["admin", "lead-stats"], queryFn: () => fetchLeads({}) });

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const rows = (requests.data ?? []) as unknown as ProductRequest[];
  const productRows = (products.data ?? []) as unknown as Product[];
  const staffRows = (staff.data ?? []) as unknown as { id: string; name: string }[];
  const productName = new Map(productRows.map((p) => [p.id, p.display_name]));
  const productSlug = new Map(productRows.map((p) => [p.id, p.slug]));
  const staffName = new Map(staffRows.map((s) => [s.id, s.name]));

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (statusFilter !== "all" && row.status !== statusFilter) return false;
        if (productFilter !== "all" && row.product_id !== productFilter) return false;
        const created = new Date(row.created_at).getTime();
        if (from && created < new Date(from).getTime()) return false;
        if (to && created > new Date(to).getTime() + 86_400_000) return false;
        return true;
      }),
    [rows, statusFilter, productFilter, from, to],
  );

  const save = useMutation({
    mutationFn: async ({
      request,
      patch,
      action,
    }: {
      request: ProductRequest;
      patch: Partial<ProductRequest>;
      action: string;
    }) => {
      await upsert({
        data: { table: "product_requests", values: { ...request, ...patch } as never },
      });
      await log({
        data: {
          action,
          entity_type: "request",
          entity_id: request.id,
          detail: patch as Record<string, unknown>,
        },
      });
    },
    onSuccess: async () => {
      toast.success("Request updated");
      await queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "lead-stats"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "activity"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const open = filtered.find((row) => row.id === openId) ?? null;

  const summary = STATUSES.map((status) => ({
    status,
    count: filtered.filter((row) => row.status === status).length,
  }));

  function exportCsv() {
    const header = ["Name", "Phone", "Product", "Status", "Assigned to", "Message", "Created"];
    const lines = filtered.map((row) =>
      [
        row.name,
        row.phone,
        productName.get(row.product_id) ?? "",
        row.status,
        row.assigned_to ? (staffName.get(row.assigned_to) ?? "") : "",
        (row.message ?? "").replace(/\s+/g, " "),
        new Date(row.created_at).toISOString(),
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `keeksurge-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold">
        <GradientText>Requests / Leads</GradientText>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {stats.data ? `${stats.data.today} today · ${stats.data.week} this week · ` : ""}
        {filtered.length} shown
      </p>

      <section className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map((item) => (
          <div key={item.status} className="rounded-xl border border-border/60 bg-surface/60 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.status}</p>
            <p className="mt-2 font-display text-2xl font-bold">{item.count}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Status
          <select
            className={FIELD}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Product
          <select
            className={FIELD}
            value={productFilter}
            onChange={(event) => setProductFilter(event.target.value)}
          >
            <option value="all">All</option>
            {productRows.map((product) => (
              <option key={product.id} value={product.id}>
                {product.display_name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          From
          <input type="date" className={FIELD} value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          To
          <input type="date" className={FIELD} value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-primary/50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 lg:table-cell">Assigned</th>
              <th className="hidden px-4 py-3 sm:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${row.phone}`}
                      className="inline-flex items-center gap-1 text-accent hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" /> {row.phone}
                    </a>
                    <a
                      href={`https://wa.me/88${row.phone}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`WhatsApp ${row.name}`}
                      className="text-muted-foreground hover:text-emerald-500"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {productName.get(row.product_id) ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Status for ${row.name}`}
                    className={`rounded-full border bg-transparent px-2 py-1 text-xs ${STATUS_CLASS[row.status]}`}
                    value={row.status}
                    disabled={save.isPending}
                    onChange={(event) =>
                      save.mutate({
                        request: row,
                        patch: { status: event.target.value as RequestStatus },
                        action: "request.status_changed",
                      })
                    }
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                  {row.assigned_to ? (staffName.get(row.assigned_to) ?? "—") : "—"}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(row.id);
                      setNoteDraft("");
                    }}
                    className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:border-primary/50"
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
            {!requests.isPending && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No requests match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenId(null)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Request from ${open.name}`}
            className="relative h-full w-full max-w-md overflow-y-auto border-l border-border/60 bg-surface p-6"
          >
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-display text-xl font-bold">{open.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(open.created_at).toLocaleString()} · via {open.source}
            </p>

            <div className="mt-4 flex gap-2">
              <a
                href={`tel:${open.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                <Phone className="h-4 w-4" /> Call {open.phone}
              </a>
              <a
                href={`https://wa.me/88${open.phone}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-primary/50"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            {open.message ? (
              <p className="mt-4 rounded-lg border border-border/60 bg-surface-2/50 p-3 text-sm text-muted-foreground">
                {open.message}
              </p>
            ) : null}

            <div className="mt-5 rounded-lg border border-border/60 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Product</p>
              <p className="mt-1 text-sm font-medium">
                {productName.get(open.product_id) ?? "Unknown"}
              </p>
              {productSlug.get(open.product_id) ? (
                <a
                  href={`/products/${productSlug.get(open.product_id)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 inline-block text-xs text-accent hover:underline"
                >
                  View public page
                </a>
              ) : null}
            </div>

            <label className="mt-5 block text-xs uppercase tracking-wider text-muted-foreground">
              Assign to
              <select
                className={`${FIELD} mt-1.5 w-full`}
                value={open.assigned_to ?? ""}
                onChange={(event) =>
                  save.mutate({
                    request: open,
                    patch: { assigned_to: event.target.value || null },
                    action: "request.assigned",
                  })
                }
              >
                <option value="">Unassigned</option>
                {staffRows.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Call log / notes</p>
              <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-surface-2/50 p-3 text-xs text-muted-foreground">
                {open.notes ?? "No notes yet."}
              </pre>
              <textarea
                rows={3}
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder="Add a note — appended with a timestamp."
                className={`${FIELD} mt-2 w-full resize-none`}
              />
              <button
                type="button"
                disabled={!noteDraft.trim() || save.isPending}
                onClick={() => {
                  const stamp = new Date().toLocaleString();
                  save.mutate({
                    request: open,
                    patch: {
                      notes: `${open.notes ? `${open.notes}\n` : ""}[${stamp}] ${noteDraft.trim()}`,
                    },
                    action: "request.note_added",
                  });
                  setNoteDraft("");
                }}
                className="mt-2 w-full rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Append note
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
