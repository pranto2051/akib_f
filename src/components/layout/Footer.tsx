import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/layout/Header";
import { subscribeNewsletter } from "@/lib/content.functions";
import type { SiteSettings } from "@/types";

const SOCIALS = [
  { field: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { field: "twitter", Icon: Twitter, label: "X" },
  { field: "facebook", Icon: Facebook, label: "Facebook" },
  { field: "instagram", Icon: Instagram, label: "Instagram" },
  { field: "youtube", Icon: Youtube, label: "YouTube" },
  { field: "github", Icon: Github, label: "GitHub" },
] as const;

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await subscribeNewsletter({ data: { email } });
      toast.success("You're subscribed. Welcome aboard!");
      setEmail("");
    } catch {
      toast.error("That didn't work. Please check the address and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        maxLength={255}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        className="min-w-0 flex-1 rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        {busy ? "…" : "Join"}
      </button>
    </form>
  );
}

export function Footer({
  settings,
}: {
  settings: SiteSettings | null | undefined;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo settings={settings} />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {settings?.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SOCIALS.map(({ field, Icon, label }) => {
              const href = settings?.[field];
              if (!href) return null;
              return (
                <a
                  key={field}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-foreground">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-foreground">
                Case studies
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-foreground">
                Admin panel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                {settings?.address}
                <br />
                {settings?.city}, {settings?.country}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`tel:${settings?.phone ?? ""}`}
                className="hover:text-foreground"
              >
                {settings?.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`mailto:${settings?.email ?? ""}`}
                className="hover:text-foreground"
              >
                {settings?.email}
              </a>
            </li>
          </ul>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border/60 py-5">
        <p className="mx-auto max-w-7xl px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {year} {settings?.site_name ?? "KeekSurge"}. All rights reserved.
          Established {settings?.founded_year ?? "2019"} in{" "}
          {settings?.city ?? "Dhaka"}.
        </p>
      </div>
    </footer>
  );
}
