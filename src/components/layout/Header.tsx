import { Link } from "@tanstack/react-router";
import { Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

function applyTheme(light: boolean) {
  document.documentElement.classList.toggle("light", light);
  document.documentElement.style.colorScheme = light ? "light" : "dark";
}

function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    // The blocking script in __root already set the class; mirror it into state.
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    applyTheme(next);
    localStorage.setItem("hm-theme", next ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}

export function Logo({
  settings,
}: {
  settings: SiteSettings | null | undefined;
}) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5"
      aria-label="Go to homepage"
    >
      {settings?.logo_url ? (
        <img
          src={settings.logo_url}
          alt={settings.site_name}
          className="h-8 w-auto"
        />
      ) : (
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          KS
        </span>
      )}
      <span className="font-display text-base font-bold tracking-tight">
        {settings?.logo_text ?? "KeekSurge"}
      </span>
    </Link>
  );
}

/** Reflects session state: sign-in link when signed out, dashboard link when signed in. */
function AuthLink() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.user));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <Link
      to={signedIn ? "/admin" : "/auth"}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ShieldCheck className="h-4 w-4" />
      <span className="hidden sm:inline">
        {signedIn ? "Dashboard" : "Admin"}
      </span>
    </Link>
  );
}

export function Header({
  settings,
}: {
  settings: SiteSettings | null | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo settings={settings} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthLink />
          <Link
            to="/contact"
            className="hidden rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:inline-flex"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col p-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
