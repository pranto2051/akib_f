import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ScrollText } from "lucide-react";

import { GradientText } from "@/components/shared/primitives";
import { adminList } from "@/lib/admin.functions";
import type { ActivityLogEntry } from "@/types";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  component: ActivityLog,
});

function ActivityLog() {
  const fetchList = useServerFn(adminList);
  const activity = useQuery({
    queryKey: ["admin", "activity"],
    queryFn: () =>
      fetchList({
        data: {
          table: "admin_activity_log",
          orderBy: "created_at",
          ascending: false,
          limit: 200,
        },
      }),
  });

  const rows = (activity.data ?? []) as unknown as ActivityLogEntry[];

  return (
    <>
      <h1 className="font-display text-3xl font-bold">
        <GradientText>Activity log</GradientText>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every content and lead change made from the admin panel.
      </p>

      <ol className="mt-6 space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/60 p-4"
          >
            <span
              aria-hidden
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted-foreground"
            >
              <ScrollText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {row.action}
                <span className="ml-2 rounded-full border border-border/70 px-2 py-0.5 text-xs font-normal text-muted-foreground">
                  {row.entity_type}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {row.actor_name ?? "Unknown user"} ·{" "}
                {new Date(row.created_at).toLocaleString()}
              </p>
              {row.detail ? (
                <pre className="mt-2 overflow-x-auto rounded-md bg-surface-2/60 p-2 text-xs text-muted-foreground">
                  {JSON.stringify(row.detail, null, 2)}
                </pre>
              ) : null}
            </div>
          </li>
        ))}
        {!activity.isPending && rows.length === 0 ? (
          <li className="rounded-xl border border-border/60 p-8 text-center text-muted-foreground">
            No activity recorded yet.
          </li>
        ) : null}
      </ol>
    </>
  );
}
