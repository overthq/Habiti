CREATE TABLE store_managers IF NOT EXISTS (
	store_id uuid not null,
	manager_id uuid not null,
	FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
	FOREIGN KEY (manager_id) REFERENCES users (id) ON DELETE CASCADE,
	PRIMARY KEY (store_id, manager_id)
)
