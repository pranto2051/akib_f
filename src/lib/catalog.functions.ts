import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Faq, Product, ProductCategory } from "@/types";

async function client() {
  const { createPublicClient } = await import("./supabase-public.server");
  return createPublicClient();
}

export const getProductCategories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ProductCategory[];
});

export const getProductDetail = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data: input }) => {
    const supabase = await client();
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", input.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) return null;

    const typed = product as unknown as Product;

    const [related, faqs, categories] = await Promise.all([
      typed.category_id
        ? supabase
            .from("products")
            .select("*")
            .eq("is_published", true)
            .eq("category_id", typed.category_id)
            .neq("id", typed.id)
            .order("sort_order")
            .limit(3)
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .eq("product_id", typed.id)
        .order("sort_order"),
      supabase.from("product_categories").select("*"),
    ]);

    const category =
      (categories.data ?? []).find(
        (row) => (row as { id: string }).id === typed.category_id,
      ) ?? null;

    return {
      product: typed,
      related: ((related.data ?? []) as unknown as Product[]),
      faqs: ((faqs.data ?? []) as unknown as Faq[]),
      category: category as unknown as ProductCategory | null,
    };
  });

const phoneRegex = /^01[3-9]\d{8}$/;

const requestSchema = z.object({
  product_id: z.string().uuid(),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, "").replace(/^(\+?88)/, ""))
    .refine((value) => phoneRegex.test(value), "Enter a valid mobile number, e.g. 01712345678"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const submitProductRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await client();
    const { error } = await supabase.from("product_requests").insert({
      product_id: data.product_id,
      name: data.name,
      phone: data.phone,
      message: data.message || null,
      source: "website",
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
