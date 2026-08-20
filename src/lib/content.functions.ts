import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type {
  BlogPost,
  Career,
  Category,
  Faq,
  Product,
  Project,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "@/types";

const slugInput = (input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input);

async function client() {
  const { createPublicClient } = await import("./supabase-public.server");
  return createPublicClient();
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data as SiteSettings | null;
});

export const getServices = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as Service[];
});

export const getService = createServerFn({ method: "GET" })
  .validator(slugInput)
  .handler(async ({ data: input }) => {
    const supabase = await client();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", input.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as Service | null;
  });

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
});

export const getProduct = createServerFn({ method: "GET" })
  .validator(slugInput)
  .handler(async ({ data: input }) => {
    const supabase = await client();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", input.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as Product | null;
  });

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("completed_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
});

export const getProject = createServerFn({ method: "GET" })
  .validator(slugInput)
  .handler(async ({ data: input }) => {
    const supabase = await client();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", input.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as Project | null;
  });

export const getBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const [posts, categories] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ]);
  if (posts.error) throw new Error(posts.error.message);
  if (categories.error) throw new Error(categories.error.message);
  return {
    posts: (posts.data ?? []) as BlogPost[],
    categories: (categories.data ?? []) as Category[],
  };
});

export const getBlogPost = createServerFn({ method: "GET" })
  .validator(slugInput)
  .handler(async ({ data: input }) => {
    const supabase = await client();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", input.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as BlogPost | null;
  });

export const getTeam = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as TeamMember[];
});

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as Testimonial[];
});

export const getFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as Faq[];
});

export const getCareers = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await client();
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Career[];
});

export const getCareer = createServerFn({ method: "GET" })
  .validator(slugInput)
  .handler(async ({ data: input }) => {
    const supabase = await client();
    const { data, error } = await supabase
      .from("careers")
      .select("*")
      .eq("slug", input.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as Career | null;
  });

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await client();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      service: data.service || null,
      budget: data.budget || null,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const applicationSchema = z.object({
  career_id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(40),
  cover_letter: z.string().trim().min(20).max(5000),
  resume_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

export const submitApplication = createServerFn({ method: "POST" })
  .validator((input: unknown) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await client();
    const { error } = await supabase.from("applications").insert({
      career_id: data.career_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cover_letter: data.cover_letter,
      resume_url: data.resume_url || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await client();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email: data.email.toLowerCase() }, { onConflict: "email" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
