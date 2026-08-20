import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { GradientText, GridPattern } from "@/components/shared/primitives";
import { supabase } from "../integrations/supabase/client";

const DEMO_EMAIL = "admin@hostelmanagement.demo";
const DEMO_PASSWORD = "DemoAdmin#2026";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — KeekSurge" },
      {
        name: "description",
        content:
          "Sign in to the KeekSurge admin dashboard to manage services, projects, blog posts, messages and site settings.",
      },
      { property: "og:title", content: "Admin Sign In — KeekSurge" },
      { property: "og:description", content: "Secure sign-in for the KeekSurge admin dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    void navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-16">
      <GridPattern />
      <div className="relative w-full max-w-md rounded-2xl border border-border/70 bg-surface/70 p-8 shadow-[var(--shadow-elegant)] backdrop-blur">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-xl text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          <ShieldCheck className="h-5 w-5" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">
          <GradientText>Admin sign in</GradientText>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the demo administrator credentials below to explore the dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-2/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-2/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-border/60 bg-surface-2/50 p-4 text-sm">
          <p className="font-semibold">Demo credentials</p>
          <p className="mt-1 text-muted-foreground">
            Email: <span className="text-foreground">{DEMO_EMAIL}</span>
          </p>
          <p className="text-muted-foreground">
            Password: <span className="text-foreground">{DEMO_PASSWORD}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
