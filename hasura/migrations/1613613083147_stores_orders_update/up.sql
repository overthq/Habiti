ALTER TABLE orders
ADD COLUMN IF NOT EXISTS amount int;

ALTER TABLE items
RENAME COLUMN price_per_unit TO unit_price;

ALTER TABLE stores
ADD COLUMN IF NOT EXISTS twitter_username varchar(15),
ADD COLUMN IF NOT EXISTS instagram_username varchar(30),
ADD COLUMN IF NOT EXISTS website_url varchar(1000);

ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS unit_price int;
