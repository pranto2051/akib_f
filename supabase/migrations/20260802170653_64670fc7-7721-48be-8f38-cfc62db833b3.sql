CREATE TYPE public.product_kind AS ENUM ('SOFTWARE','HARDWARE','MOBILE_APP','WEB_APP');

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  kind public.product_kind NOT NULL DEFAULT 'SOFTWARE',
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Package',
  image_url text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  product_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "products_staff_manage" ON public.products FOR ALL TO authenticated
  USING (public.has_min_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_min_role(auth.uid(), 'staff'));

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.products (name, display_name, slug, kind, tagline, description, icon_name, features, is_featured, sort_order) VALUES
('Hostel Management System','Hostel Management System','hostel-management-system','SOFTWARE','Complete residence, billing and gate operations platform','End-to-end hostel operations: room allocation, resident records, invoicing, mess management, visitor and gate logs, and analytics for wardens and owners.','Building2','["Room and bed allocation","Automated invoicing and dues","Mess and meal planning","Visitor and gate logs","Warden dashboards and reports"]'::jsonb, true, 1),
('Fingerprint Attendance System','Fingerprint Attendance System','fingerprint-attendance-system','HARDWARE','Biometric auto check-in and check-out devices','Fingerprint terminals designed and manufactured in-house for organisations that need reliable, tamper-proof automatic check-in and check-out at every entry point.','Fingerprint','["Fingerprint and RFID capture","Automatic check-in / check-out","Offline buffering with sync","Cloud dashboard integration","Custom branding per client"]'::jsonb, true, 2),
('Attendance Management System','Attendance Management System','attendance-management-system','WEB_APP','Device plus web platform for workforce attendance','A combined hardware and web solution: our attendance devices feed a web platform with shift rules, leave, overtime and payroll-ready exports. The product name is configurable per client.','Clock','["Device to cloud sync","Shift, leave and overtime rules","Payroll-ready exports","Multi-branch support","White-label naming"]'::jsonb, true, 3),
('Custom Mobile Applications','Custom Mobile Applications','custom-mobile-applications','MOBILE_APP','iOS and Android apps built to your requirements','We design and build mobile application software tailored to each client requirement, delivered under whichever product name the client chooses.','Smartphone','["iOS and Android","Requirement-driven scope","API and device integration","Store submission support","Ongoing maintenance"]'::jsonb, false, 4);