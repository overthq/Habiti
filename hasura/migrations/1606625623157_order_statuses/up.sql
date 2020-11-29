ALTER TABLE orders
ADD COLUMN IF NOT EXISTS status text default 'pending';

ALTER TABLE orders
ADD CONSTRAINT order_status_fkey FOREIGN KEY (status) REFERENCES order_status;
