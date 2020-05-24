CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	phone VARCHAR(255) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stores (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	short_name VARCHAR(30) UNIQUE NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_profiles (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	store_id UUID NOT NULL,
	website_url VARCHAR(255),
	instagram_username VARCHAR(30),
	twitter_username VARCHAR(15),
	FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);

CREATE TYPE item_unit AS ENUM ('Kilogram', 'Litre', 'Cup');

CREATE TABLE IF NOT EXISTS items (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	store_id UUID NOT NULL,
	name VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	unit item_unit NOT NULL,
	price_per_unit INT NOT NULL,
	featured BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);

CREATE TYPE order_status AS ENUM ('Pending', 'Processing', 'Fulfilled');

CREATE TABLE IF NOT EXISTS orders (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id UUID NOT NULL,
	store_id UUID NOT NULL,
	status order_status DEFAULT 'Pending',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
	FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS managers (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	store_id UUID NOT NULL,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	order_id UUID NOT NULL,
	item_id UUID NOT NULL,
	quantity INT NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
	FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS store_followers (
	id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	store_id UUID NOT NULL,
	user_id UUID NOT NULL,
	FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
	t text;
BEGIN
	FOR t IN
		SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at'
	LOOP
		EXECUTE format('CREATE TRIGGER trigger_update_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp()', t, t);
	END loop;
END;
$$ language 'plpgsql';
