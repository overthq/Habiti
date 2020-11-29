ALTER TABLE items
ADD COLUMN IF NOT EXISTS name varchar(255) not null,
ADD COLUMN IF NOT EXISTS description text not null;
