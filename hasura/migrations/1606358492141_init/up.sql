CREATE TABLE IF NOT EXISTS users (
	id uuid primary key not null default gen_random_uuid(),
	name varchar(255) not null,
	phone varchar(255) unique not null,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS stores (
	id uuid primary key not null default gen_random_uuid(),
	name varchar(255) not null,
	short_name varchar(255) not null,
	verified boolean not null default false,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS order_status (
	value text primary key not null
);

INSERT INTO order_status (value) VALUES ('pending'), ('processing'), ('delivered');

CREATE TABLE IF NOT EXISTS orders (
	id uuid primary key not null default gen_random_uuid(),
	user_id uuid not null,
	store_id uuid not null,
	created_at timestamptz default now(),
	updated_at timestamptz default now(),
	foreign key (user_id) references users (id) on delete cascade,
	foreign key (store_id) references stores (id) on delete cascade
);

CREATE TABLE IF NOT EXISTS item_unit (
	value text primary key not null
);

INSERT INTO item_unit (value) VALUES ('units');

CREATE TABLE IF NOT EXISTS items (
	id uuid primary key not null default gen_random_uuid(),
	store_id uuid not null,
	price_per_unit int not null,
	unit text not null,
	created_at timestamptz default now(),
	updated_at timestamptz default now(),
	foreign key (store_id) references stores (id) on delete cascade,
	foreign key (unit) references item_unit
);

CREATE TABLE IF NOT EXISTS store_followers (
	store_id uuid not null,
	follower_id uuid not null,
	primary key (store_id, follower_id),
	foreign key (store_id) references stores (id) on delete cascade,
	foreign key (follower_id) references users (id) on delete cascade
);

CREATE TABLE IF NOT EXISTS order_items (
	id uuid primary key not null default gen_random_uuid(),
	item_id uuid not null,
	quantity int not null,
	foreign key (item_id) references items (id) on delete cascade
);
