-- Migration to remove invoice_id and plan from transactions table
ALTER TABLE transactions DROP COLUMN IF EXISTS invoice_id;
ALTER TABLE transactions DROP COLUMN IF EXISTS plan;
