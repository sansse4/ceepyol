ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'credit_card';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
