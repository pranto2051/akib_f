import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { submitProductRequest } from "@/lib/catalog.functions";

const FIELD =
  "w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const clientSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, "").replace(/^(\+?88)/, ""))
    .refine((value) => /^01[3-9]\d{8}$/.test(value), "Enter a valid mobile number, e.g. 01712345678"),
  message: z.string().trim().max(1000).optional(),
});

/** Compact lead-capture modal: name + mobile number (+ optional note). No login needed. */
export function ProductRequestModal({
  productId,
  productName,
  open,
  onClose,
}: {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
}) {
  const submit = useServerFn(submitProductRequest);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: (values: { name: string; phone: string; message?: string }) =>
      submit({ data: { product_id: productId, ...values } }),
    onSuccess: () => setDone(true),
    onError: (error: Error) => setErrors({ form: error.message }),
  });

  useEffect(() => {
    if (!open) return;
    setDone(false);
    setErrors({});
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = clientSchema.safeParse({
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    mutation.mutate({
      name: parsed.data.name,
      phone: parsed.data.phone,
      ...(parsed.data.message ? { message: parsed.data.message } : {}),
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Request ${productName}`}
        className="glass-card relative w-full max-w-md rounded-t-2xl p-6 sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">Thanks! Our team will call you shortly.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We received your interest in {productName}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Request {productName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Leave your name and mobile number — we call back the same day.
              </p>
            </div>

            <div>
              <label htmlFor="req-name" className="text-sm font-medium">
                Name<span className="text-destructive"> *</span>
              </label>
              <input id="req-name" name="name" required maxLength={100} className={`${FIELD} mt-1.5`} />
              {errors['name'] ? <p className="mt-1 text-xs text-destructive">{errors['name']}</p> : null}
            </div>

            <div>
              <label htmlFor="req-phone" className="text-sm font-medium">
                Mobile number<span className="text-destructive"> *</span>
              </label>
              <input
                id="req-phone"
                name="phone"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="01712345678"
                className={`${FIELD} mt-1.5`}
              />
              {errors['phone'] ? (
                <p className="mt-1 text-xs text-destructive">{errors['phone']}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="req-message" className="text-sm font-medium">
                Anything you&apos;d like to add?
              </label>
              <textarea
                id="req-message"
                name="message"
                rows={3}
                maxLength={1000}
                className={`${FIELD} mt-1.5 resize-none`}
              />
            </div>

            {errors['form'] ? <p className="text-xs text-destructive">{errors['form']}</p> : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send request
            </button>
            <p className="text-center text-xs text-muted-foreground">
              No account needed. We never share your number.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
