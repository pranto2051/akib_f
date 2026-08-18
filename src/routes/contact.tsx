import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { ContactForm } from "@/components/shared/ContactForm";
import { GlassCard } from "@/components/shared/primitives";
import { faqsQuery, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(faqsQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Contact Us — Start a Project With KeekSurge" },
      {
        name: "description",
        content:
          "Talk to our engineering team in Dhaka about hostel platforms, custom software or an ERP rollout. We reply within one business day.",
      },
      { property: "og:title", content: "Contact — KeekSurge" },
      { property: "og:description", content: "Tell us about your project. We reply within one business day." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <PageHero title="Not found" />,
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: faqs } = useSuspenseQuery(faqsQuery);

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero
            eyebrow="Contact"
            title="Tell us what you're trying to fix"
            description="A senior engineer reads every message. Expect a reply within one business day."
          />

          <section className="py-16 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
              <ContactForm />

              <div className="space-y-6">
                <GlassCard hover={false} className="p-6">
                  <h2 className="text-base font-semibold">Direct lines</h2>
                  <ul className="mt-4 space-y-4 text-sm">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">
                        {settings?.address}
                        <br />
                        {settings?.city} {settings?.postal_code}, {settings?.country}
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <a href={`tel:${settings?.phone ?? ""}`} className="text-muted-foreground hover:text-foreground">
                        {settings?.phone}
                      </a>
                    </li>
                    <li className="flex gap-3">
                      <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <a
                        href={`https://wa.me/${(settings?.whatsapp ?? "").replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        WhatsApp {settings?.whatsapp}
                      </a>
                    </li>
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">
                        <a href={`mailto:${settings?.email_sales ?? ""}`} className="hover:text-foreground">
                          {settings?.email_sales}
                        </a>{" "}
                        (new projects)
                        <br />
                        <a href={`mailto:${settings?.email_support ?? ""}`} className="hover:text-foreground">
                          {settings?.email_support}
                        </a>{" "}
                        (existing clients)
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{settings?.business_hours}</span>
                    </li>
                  </ul>
                </GlassCard>

                {settings?.google_maps_embed_url ? (
                  <div className="overflow-hidden rounded-xl border border-border/60">
                    <iframe
                      title="Office location map"
                      src={settings.google_maps_embed_url}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-64 w-full border-0"
                    />
                  </div>
                ) : null}

                <GlassCard hover={false} className="p-6">
                  <h2 className="text-base font-semibold">Before you write</h2>
                  <div className="mt-3 divide-y divide-border/60">
                    {faqs.slice(0, 4).map((faq) => (
                      <details key={faq.id} className="py-3">
                        <summary className="cursor-pointer list-none text-sm font-medium">
                          {faq.question}
                        </summary>
                        <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </section>
        </>
      )}
    </SiteShell>
  );
}
