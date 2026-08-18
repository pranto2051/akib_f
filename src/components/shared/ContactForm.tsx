import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { submitContactMessage } from "@/lib/content.functions";

const SERVICES = [
  "Hostel Management System",
  "Fingerprint Attendance Device",
  "Attendance Management System",
  "Custom Hardware",
  "Custom Software",
  "Web Application",
  "Mobile App",
  "ERP / CRM",
  "Cloud & DevOps",
  "IoT Integration",
  "AI Integration",
  "Something else",
];

const BUDGETS = ["Under $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not sure yet"];

const FIELD_CLASS =
  "w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (values: Record<string, string>) =>
      submitContactMessage({
        data: {
          name: values['name'] ?? "",
          email: values['email'] ?? "",
          phone: values['phone'] ?? "",
          company: values['company'] ?? "",
          service: values['service'] ?? "",
          budget: values['budget'] ?? "",
          message: values['message'] ?? "",
        },
      }),
    onSuccess: () => toast.success("Message sent. We reply within one business day."),
    onError: () => toast.error("We couldn't send that. Please check the fields and retry."),
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!values['name'] || values['name'].trim().length < 2) nextErrors['name'] = "Please enter your name.";
    if (!values['email'] || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values['email']))
      nextErrors['email'] = "Please enter a valid email address.";
    if (!values['message'] || values['message'].trim().length < 10)
      nextErrors['message'] = "Tell us a little more (10 characters minimum).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    mutation.mutate(values, { onSuccess: () => form.reset() });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass-card rounded-xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full name *
          </label>
          <input id="name" name="name" maxLength={100} className={FIELD_CLASS} placeholder="Ayesha Rahman" />
          {errors['name'] ? <p className="mt-1 text-xs text-destructive">{errors['name']}</p> : null}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Work email *
          </label>
          <input id="email" name="email" type="email" maxLength={255} className={FIELD_CLASS} placeholder="you@company.com" />
          {errors['email'] ? <p className="mt-1 text-xs text-destructive">{errors['email']}</p> : null}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Phone
          </label>
          <input id="phone" name="phone" maxLength={40} className={FIELD_CLASS} placeholder="+880 …" />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium">
            Company
          </label>
          <input id="company" name="company" maxLength={120} className={FIELD_CLASS} placeholder="Company name" />
        </div>
        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium">
            Service of interest
          </label>
          <select id="service" name="service" className={FIELD_CLASS} defaultValue="">
            <option value="">Select a service</option>
            {SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="mb-1.5 block text-sm font-medium">
            Budget range
          </label>
          <select id="budget" name="budget" className={FIELD_CLASS} defaultValue="">
            <option value="">Select a range</option>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
            How can we help? *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={4000}
            className={FIELD_CLASS}
            placeholder="Tell us about your project, timeline and what success looks like."
          />
          {errors['message'] ? <p className="mt-1 text-xs text-destructive">{errors['message']}</p> : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-6 w-full rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        {mutation.isPending ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        We sign NDAs before any technical discussion. Your details are never shared.
      </p>
    </form>
  );
}
