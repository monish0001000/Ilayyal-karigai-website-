-- ==============================================================================
-- ILAYAL KARIGAI — DATABASE INITIAL SCHEMA & SECURITY MIGRATION
-- Production-ready PostgreSQL schema with Row Level Security (RLS)
-- Compatible with Supabase and standard cloud PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    tamil_name VARCHAR(128),
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tamil VARCHAR(255),
    subtitle VARCHAR(255),
    category VARCHAR(128) NOT NULL,
    collection_category VARCHAR(128) NOT NULL,
    price_number INT NOT NULL CHECK (price_number >= 0),
    price VARCHAR(64) NOT NULL,
    original_price VARCHAR(64),
    image TEXT NOT NULL,
    color VARCHAR(255) NOT NULL,
    stock VARCHAR(128) NOT NULL DEFAULT 'In stock',
    stock_status VARCHAR(32) NOT NULL DEFAULT 'in-stock' CHECK (stock_status IN ('in-stock', 'low-stock', 'out-of-stock')),
    sizes TEXT[] NOT NULL DEFAULT ARRAY['S', 'M', 'L', 'XL'],
    fabric TEXT NOT NULL,
    description TEXT NOT NULL,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    sales_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast storefront lookups
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_category);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4.1 PUBLIC READ POLICIES
-- Anyone can view active categories
CREATE POLICY "Public categories read access"
    ON public.categories
    FOR SELECT
    USING (is_active = TRUE);

-- Anyone can view published active products on the storefront
CREATE POLICY "Public active products read access"
    ON public.products
    FOR SELECT
    USING (is_active = TRUE);

-- 4.2 AUTHENTICATED ADMINISTRATOR POLICIES
-- Only authenticated users (admins) can view ALL products (including drafts and hidden items)
CREATE POLICY "Admin read all products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (TRUE);

-- Only authenticated admins can insert new products
CREATE POLICY "Admin insert products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- Only authenticated admins can update products
CREATE POLICY "Admin update products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Only authenticated admins can delete products
CREATE POLICY "Admin delete products"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (TRUE);

-- Admin policies for categories
CREATE POLICY "Admin manage categories"
    ON public.categories
    FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 5. STORAGE BUCKET FOR PRODUCT IMAGES
-- (Run within Supabase Storage configuration)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public product images access"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');

-- Allow authenticated admins to upload product images
CREATE POLICY "Admin upload product images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated admins to delete product images
CREATE POLICY "Admin delete product images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');
