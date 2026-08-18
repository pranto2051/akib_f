import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Briefcase, FileText, FolderKanban, Inbox, Mail, Package, Users } from "lucide-react";

import { GradientText } from "@/components/shared/primitives";
import { adminList, adminStats, leadStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

const STAT_META: Record<string, { label: string; icon: typeof FileText }> = {
  services: { label: "Services", icon: Briefcase },
  products: { label: "Products", icon: Package },
  projects: { label: "Projects", icon: FolderKanban },
  blog_posts: { label: "Blog posts", icon: FileText },
  contact_messages: { label: "Messages", icon: Inbox },
  applications: { label: "Applications", icon: Users },
  newsletter_subscribers: { label: "Subscribers", icon: Mail },
};

const STATUS_ORDER = ["NEW", "CONTACTED", "INTERESTED", "CONVERTED", "LOST"] as const;

function AdminOverview() {
  const fetchStats = useServerFn(adminStats);
  const fetchLeads = useServerFn(leadStats);
  const fetchList = useServerFn(adminList);

  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: () => fetchStats({}) });
  const leads = useQuery({ queryKey: ["admin", "lead-stats"], queryFn: () => fetchLeads({}) });
  const messages = useQuery({
    queryKey: ["admin", "messages", "latest"],
    queryFn: () =>
      fetchList({
        data: { table: "contact_messages", orderBy: "created_at", ascending: false, limit: 6 },
      }),
  });

  const counts = stats.data?.counts ?? {};
  const byStatus = leads.data?.byStatus ?? {};
  const maxStatus = Math.max(1, ...STATUS_ORDER.map((status) => byStatus[status] ?? 0));

  return (
    <>
      <h1 className="font-display text-3xl font-bold">
        <GradientText>Overview</GradientText>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {stats.data
          ? `${stats.data.unreadMessages} unread message${stats.data.unreadMessages === 1 ? "" : "s"}`
          : "Loading live counts…"}
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="New requests today" value={leads.data?.today ?? "—"} accent />
        <Metric label="This week" value={leads.data?.week ?? "—"} />
        <Metric
          label="Conversion rate"
          value={leads.data ? `${Math.round(leads.data.conversionRate * 100)}%` : "—"}
        />
        <Metric
          label="Avg. time to contact"
          value={
            leads.data?.avgHoursToContact != null
              ? `${leads.data.avgHoursToContact.toFixed(1)} h`
              : "—"
          }
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-surface/60 p-5">
          <h2 className="font-display text-lg font-semibold">Request funnel</h2>
          <div className="mt-4 space-y-3">
            {STATUS_ORDER.map((status) => {
              const value = byStatus[status] ?? 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{status}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(value / maxStatus) * 100}%`,
                        backgroundImage: "var(--gradient-brand)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-surface/60 p-5">
          <h2 className="font-display text-lg font-semibold">Product interest</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Most requested: {leads.data?.topProduct?.[0] ?? "—"}
            {leads.data?.topProduct ? ` (${leads.data.topProduct[1]})` : ""}
            <br />
            Top category: {leads.data?.topCategory?.[0] ?? "—"}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(leads.data?.byProduct ?? {})
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([name, value]) => (
                <li key={name} className="flex items-center justify-between gap-3">
                  <span className="truncate">{name}</span>
                  <span className="text-muted-foreground">{value}</span>
                </li>
              ))}
            {leads.data && Object.keys(leads.data.byProduct).length === 0 ? (
              <li className="text-muted-foreground">No requests yet.</li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(STAT_META).map(([key, meta]) => {
          const Icon = meta.icon;
          return (
            <div key={key} className="rounded-xl border border-border/60 bg-surface/60 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{meta.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold">
                {stats.isPending ? "—" : (counts[key] ?? 0)}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Latest contact messages</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 sm:table-cell">Message</th>
              </tr>
            </thead>
            <tbody>
              {(messages.data ?? []).map((row) => (
                <tr key={String(row['id'])} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{String(row['name'] ?? "")}</td>
                  <td className="px-4 py-3 text-muted-foreground">{String(row['email'] ?? "")}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-border/70 px-2 py-0.5 text-xs">
                      {String(row['status'] ?? "")}
                    </span>
                  </td>
                  <td className="hidden max-w-md truncate px-4 py-3 text-muted-foreground sm:table-cell">
                    {String(row['message'] ?? "")}
                  </td>
                </tr>
              ))}
              {!messages.isPending && (messages.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    No messages yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl border border-border/60 p-5"
      style={accent ? { backgroundImage: "var(--gradient-subtle)" } : undefined}
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
