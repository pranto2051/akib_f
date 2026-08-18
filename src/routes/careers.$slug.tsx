import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, Check, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHero, SiteShell } from "@/components/layout/SiteShell";
import { GlassCard } from "@/components/shared/primitives";
import { submitApplication } from "@/lib/content.functions";
import { careerQuery } from "@/lib/queries";

export const Route = createFileRoute("/careers/$slug")({
  loader: async ({ context, params }) => {
    const career = await context.queryClient.ensureQueryData(careerQuery(params.slug));
    if (!career) throw notFound();
    return { title: career.title, description: career.description.slice(0, 155) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Careers` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.title} — Careers` },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <SiteShell>
      {() => <PageHero title="Role not found" description="This position may have been filled." />}
    </SiteShell>
  ),
  component: CareerDetailPage,
});

const FIELD_CLASS =
  "w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function ApplicationForm({ careerId }: { careerId: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (values: Record<string, string>) =>
      submitApplication({
        data: {
          career_id: careerId,
          name: values['name'] ?? "",
          email: values['email'] ?? "",
          phone: values['phone'] ?? "",
          cover_letter: values['cover_letter'] ?? "",
          resume_url: values['resume_url'] ?? "",
        },
      }),
    onSuccess: () => toast.success("Application received. We review every one within a week."),
    onError: () => toast.error("We couldn't submit that. Please check the fields and retry."),
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const next: Record<string, string> = {};
    if (!values['name'] || values['name'].trim().length < 2) next['name'] = "Enter your full name.";
    if (!values['email'] || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values['email']))
      next['email'] = "Enter a valid email.";
    if (!values['phone'] || values['phone'].trim().length < 6) next['phone'] = "Enter a contact number.";
    if (!values['cover_letter'] || values['cover_letter'].trim().length < 20)
      next['cover_letter'] = "Tell us why you're a fit (20 characters minimum).";
    if (values['resume_url'] && !/^https?:\/\//.test(values['resume_url']))
      next['resume_url'] = "Use a full URL starting with https://";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    mutation.mutate(values, { onSuccess: () => form.reset() });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass-card rounded-xl p-6">
      <h2 className="text-lg font-semibold">Apply for this role</h2>
      <div className="mt-5 grid gap-4">
        <div>
          <label htmlFor="app-name" className="mb-1.5 block text-sm font-medium">
            Full name *
          </label>
          <input id="app-name" name="name" maxLength={100} className={FIELD_CLASS} />
          {errors['name'] ? <p className="mt-1 text-xs text-destructive">{errors['name']}</p> : null}
        </div>
        <div>
          <label htmlFor="app-email" className="mb-1.5 block text-sm font-medium">
            Email *
          </label>
          <input id="app-email" name="email" type="email" maxLength={255} className={FIELD_CLASS} />
          {errors['email'] ? <p className="mt-1 text-xs text-destructive">{errors['email']}</p> : null}
        </div>
        <div>
          <label htmlFor="app-phone" className="mb-1.5 block text-sm font-medium">
            Phone *
          </label>
          <input id="app-phone" name="phone" maxLength={40} className={FIELD_CLASS} />
          {errors['phone'] ? <p className="mt-1 text-xs text-destructive">{errors['phone']}</p> : null}
        </div>
        <div>
          <label htmlFor="app-resume" className="mb-1.5 block text-sm font-medium">
            Resume link
          </label>
          <input
            id="app-resume"
            name="resume_url"
            maxLength={500}
            placeholder="https://drive.google.com/…"
            className={FIELD_CLASS}
          />
          {errors['resume_url'] ? (
            <p className="mt-1 text-xs text-destructive">{errors['resume_url']}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="app-cover" className="mb-1.5 block text-sm font-medium">
            Cover note *
          </label>
          <textarea id="app-cover" name="cover_letter" rows={5} maxLength={5000} className={FIELD_CLASS} />
          {errors['cover_letter'] ? (
            <p className="mt-1 text-xs text-destructive">{errors['cover_letter']}</p>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-6 w-full rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        {mutation.isPending ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

function CareerDetailPage() {
  const { slug } = Route.useParams();
  const { data: career } = useSuspenseQuery(careerQuery(slug));
  if (!career) return null;

  return (
    <SiteShell>
      {() => (
        <>
          <PageHero eyebrow={career.department} title={career.title} />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Link
              to="/careers"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All roles
            </Link>

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> {career.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {career.location}
                  </span>
                  <span>{career.type.replace("_", " ").toLowerCase()}</span>
                  <span>{career.experience}</span>
                  {career.salary ? <span>{career.salary}</span> : null}
                </div>

                <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {career.description}
                </p>

                <h2 className="mt-10 text-xl font-bold">Requirements</h2>
                <ul className="mt-4 space-y-2.5">
                  {career.requirements.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="mt-10 text-xl font-bold">Benefits</h2>
                <ul className="mt-4 space-y-2.5">
                  {career.benefits.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {career.deadline ? (
                  <GlassCard hover={false} className="mt-10 p-5">
                    <p className="text-sm">
                      Applications close on{" "}
                      <span className="font-semibold">
                        {new Date(career.deadline).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      .
                    </p>
                  </GlassCard>
                ) : null}
              </div>

              <div>
                <ApplicationForm careerId={career.id} />
              </div>
            </div>
          </div>
        </>
      )}
    </SiteShell>
  );
}
