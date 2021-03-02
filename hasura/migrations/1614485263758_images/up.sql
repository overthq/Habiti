CREATE TABLE IF NOT EXISTS images (
	id uuid primary key default gen_random_uuid(),
	path_url varchar(2083) not null,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS item_images (
	item_id uuid not null,
	image_id uuid not null,
	order_place int not null,
	foreign key (item_id) references items (id) on delete cascade,
	foreign key (image_id) references images (id) on delete cascade,
	primary key (image_id, item_id, order_place)
);

CREATE TABLE IF NOT EXISTS store_avatar_images (
	store_id uuid not null,
	image_id uuid not null,
	foreign key (store_id) references stores (id) on delete cascade,
	foreign key (image_id) references images (id) on delete cascade,
	primary key (store_id, image_id)
);

