create table if not exists carts (
	user_id uuid not null,
	store_id uuid not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	foreign key (user_id) references users (id),
	foreign key (store_id) references stores (id),
	primary key (user_id, store_id)
);

create table if not exists cart_items (
	cart_id uuid not null,
	item_id uuid not null,
	quantity int not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	foreign key (item_id) references items (id),
	foreign key (cart_id) references items (id),
	primary key (cart_id, item_id)
);
