-- Run this once on your test_db to add the columns needed for
-- stock counting and weighted-average cost P&L calculations.
-- Safe to run on existing data — all columns are nullable or have defaults.

ALTER TABLE Inventory
    ADD COLUMN IF NOT EXISTS QuantityOnHand    INT            NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ReservedQuantity  INT            NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS CurrentAvgCost    DECIMAL(12,4)  NULL,
    ADD COLUMN IF NOT EXISTS CurrentStockValue DECIMAL(14,4)  NULL;
