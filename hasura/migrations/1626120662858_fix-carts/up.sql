alter table carts drop constraint carts_pkey;
alter table carts add column id uuid primary key not null default gen_random_uuid();
alter table carts add constraint user_id_store_id_unique unique (user_id, store_id);

alter table cart_items drop constraint cart_items_pkey;
alter table cart_items add column id uuid primary key not null default gen_random_uuid();
alter table cart_items drop constraint cart_items_cart_id_fkey;
alter table cart_items add foreign key (cart_id) references carts (id);
alter table cart_items add constraint cart_id_item_id_unique unique (cart_id, item_id);
