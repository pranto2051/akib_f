export type Json = string | number | boolean | null | Json[] | { [k: string]: Json | undefined };

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url: string | null;
  logo_text: string;
  favicon_url: string | null;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  phone: string;
  whatsapp: string;
  email: string;
  email_support: string;
  email_sales: string;
  business_hours: string;
  founded_year: string;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  github: string | null;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image_url: string | null;
  google_analytics_id: string | null;
  google_maps_embed_url: string | null;
  latitude: string | null;
  longitude: string | null;
  primary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  text_muted_color: string;
  border_color: string;
  gradient_start: string;
  gradient_end: string;
  display_font: string;
  body_font: string;
  custom_css: string | null;
  hero_eyebrow: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary_text: string;
  hero_cta_primary_url: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_url: string;
  hero_image_url: string | null;
  stats: StatItem[];
  trusted_by_logos: TrustedLogo[];
  maintenance_mode: boolean;
  maintenance_message: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface TrustedLogo {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  icon_name: string;
  image_url: string | null;
  features: string[];
  benefits: string[];
  tech_stack: string[];
  pricing_overview: string | null;
  faqs: { question: string; answer: string }[];
  is_published: boolean;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  category: string;
  client_name: string | null;
  project_url: string | null;
  github_url: string | null;
  cover_image_url: string | null;
  images: string[];
  tech_stack: string[];
  features: string[];
  is_featured: boolean;
  is_published: boolean;
  completed_at: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  author_name: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  views: number;
  reading_time: number | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  department: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
  is_leadership: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  avatar_url: string | null;
  review: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
}

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";

export interface Career {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: EmploymentType;
  experience: string;
  salary: string | null;
  description: string;
  requirements: string[];
  benefits: string[];
  deadline: string | null;
}

export type MessageStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  status: MessageStatus;
  notes: string | null;
  created_at: string;
}

export type AppRole = "super_admin" | "admin" | "manager" | "staff";

export type ProductKind = "SOFTWARE" | "HARDWARE" | "MOBILE_APP" | "WEB_APP";

export interface Product {
  id: string;
  name: string;
  /** Client-facing name, editable from the admin panel. */
  display_name: string;
  slug: string;
  kind: ProductKind;
  tagline: string;
  description: string;
  icon_name: string;
  image_url: string | null;
  features: string[];
  product_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  category_id: string | null;
  gallery_images: string[];
  benefits: string[];
  hardware_specs: HardwareSpec[];
  price_note: string | null;
  show_request_button: boolean;
  meta_title: string | null;
  meta_desc: string | null;
}

export interface HardwareSpec {
  label: string;
  value: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon_name: string | null;
  description: string | null;
  sort_order: number;
}

export type RequestStatus = "NEW" | "CONTACTED" | "INTERESTED" | "CONVERTED" | "LOST";

export interface ProductRequest {
  id: string;
  product_id: string;
  name: string;
  phone: string;
  message: string | null;
  status: RequestStatus;
  assigned_to: string | null;
  notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  detail: Json | null;
  created_at: string;
}
