import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GradientText } from "@/components/shared/primitives";
import { adminList, adminUpsert } from "@/lib/admin.functions";
import type { ContactMessage, MessageStatus } from "@/types";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesManager,
});

const STATUSES: MessageStatus[] = ["UNREAD", "READ", "REPLIED", "ARCHIVED"];

function MessagesManager() {
  const queryClient = useQueryClient();
  const fetchList = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const [filter, setFilter] = useState<string>("all");

  const messages = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () =>
      fetchList({
        data: { table: "contact_messages", orderBy: "created_at", ascending: false, limit: 300 },
      }),
  });

  const rows = ((messages.data ?? []) as unknown as ContactMessage[]).filter(
    (row) => filter === "all" || row.status === filter,
  );

  const save = useMutation({
    mutationFn: (values: ContactMessage) =>
      upsert({ data: { table: "contact_messages", values: values as never } }),
    onSuccess: async () => {
      toast.success("Message updated");
      await queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <h1 className="font-display text-3xl font-bold">
        <GradientText>Contact messages</GradientText>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{rows.length} shown</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["all", ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              filter === status
                ? "border-primary/60 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl border border-border/60 bg-surface/60 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">
                  <a href={`mailto:${row.email}`} className="hover:underline">
                    {row.email}
                  </a>
                  {row.phone ? ` · ${row.phone}` : ""}
                  {row.company ? ` · ${row.company}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label={`Status for ${row.name}`}
                  className="rounded-md border border-input bg-surface px-2 py-1 text-xs"
                  value={row.status}
                  onChange={(event) =>
                    save.mutate({ ...row, status: event.target.value as MessageStatus })
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <a
                  href={`mailto:${row.email}?subject=Re: your enquiry to KeekSurge`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:border-primary/50"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply
                </a>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{row.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(row.created_at).toLocaleString()}
              {row.service ? ` · interested in ${row.service}` : ""}
              {row.budget ? ` · budget ${row.budget}` : ""}
            </p>
          </li>
        ))}
        {!messages.isPending && rows.length === 0 ? (
          <li className="rounded-xl border border-border/60 p-8 text-center text-muted-foreground">
            No messages here.
          </li>
        ) : null}
      </ul>
    </>
  );
}
