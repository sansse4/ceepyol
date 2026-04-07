-- Schema script for TechBay (ceepyol) E-commerce

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  monthly_price numeric,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  storage jsonb,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text NOT NULL,
  badges text[] NOT NULL DEFAULT '{}',
  condition text NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  rating numeric NOT NULL DEFAULT 5,
  review_count int NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  type text NOT NULL,
  bg_color text NOT NULL DEFAULT '#000000',
  text_color text NOT NULL DEFAULT '#ffffff',
  link text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Discount Codes
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL,
  value numeric NOT NULL,
  min_order numeric NOT NULL DEFAULT 0,
  max_uses int NOT NULL DEFAULT 0,
  used_count int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  bg_color text NOT NULL DEFAULT '#f8f9ff',
  bg_gradient text NOT NULL DEFAULT 'linear-gradient(135deg, #f8f9ff 0%, #e8f5e9 100%)',
  bg_image text NOT NULL DEFAULT '',
  bg_mode text NOT NULL DEFAULT 'color',
  primary_color text NOT NULL DEFAULT '#006e28',
  accent_color text NOT NULL DEFAULT '#be0037',
  promo_text text NOT NULL DEFAULT '',
  site_name text NOT NULL DEFAULT 'ceepyol',
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert initial site settings row
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 5. Orders and Cart
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL DEFAULT 'card',
  payment_status text NOT NULL DEFAULT 'pending',
  shipping_address text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  selected_color text,
  selected_storage text,
  unit_price numeric NOT NULL,
  product_name text NOT NULL,
  product_image text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
