-- Add payment proof columns to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'proof_uploaded', 'verified', 'rejected'));

-- Create payment-proofs storage bucket (public so proof URLs are accessible)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT DO NOTHING;

-- RLS: allow authenticated users to upload proofs
CREATE POLICY IF NOT EXISTS "Users can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- RLS: allow anonymous users to upload (guest checkout support)
CREATE POLICY IF NOT EXISTS "Anon can upload payment proofs"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'payment-proofs');

-- RLS: public read for admin panel access
CREATE POLICY IF NOT EXISTS "Public read payment proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- Note: DELETE is not granted to anon/authenticated — only service_role can delete
