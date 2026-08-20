import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bell,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — KeekSurge" },
      { name: "description", content: "Manage products, leads and content for KeekSurge." },
      { property: "og:title", content: "Admin Dashboard — KeekSurge" },
      { property: "og:description", content: "Internal dashboard for the KeekSurge website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/requests", label: "Requests / Leads", icon: Users, exact: false },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/product-categories", label: "Categories", icon: FolderTree, exact: false },
  { to: "/admin/messages", label: "Messages", icon: Inbox, exact: false },
  { to: "/admin/activity", label: "Activity log", icon: ScrollText, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchRoles = useServerFn(getMyRoles);
  const roles = useQuery({ queryKey: ["admin", "roles"], queryFn: () => fetchRoles({}) });
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [liveLeads, setLiveLeads] = useState(0);

  useEffect(() => {
    const channel = supabase
      .channel("admin-product-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "product_requests" },
        () => {
          setLiveLeads((count) => count + 1);
          void queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
          void queryClient.invalidateQueries({ queryKey: ["admin", "lead-stats"] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-surface/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-sm font-bold">KeekSurge admin</p>
              <p className="text-xs text-muted-foreground">
                {roles.data?.roles.length ? roles.data.roles.join(", ") : "Signed in"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/requests"
              aria-label={`New requests: ${liveLeads}`}
              className="relative rounded-md border border-border p-2 hover:border-primary/50"
            >
              <Bell className="h-4 w-4" />
              {liveLeads > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {liveLeads}
                </span>
              ) : null}
            </Link>
            <Link
              to="/"
              className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-destructive/60 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <nav aria-label="Admin sections" className="lg:w-56 lg:shrink-0">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                    style={active ? { backgroundImage: "var(--gradient-brand)" } : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {item.to === "/admin/requests" && liveLeads > 0 ? (
                      <span className="ml-auto rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                        {liveLeads}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
