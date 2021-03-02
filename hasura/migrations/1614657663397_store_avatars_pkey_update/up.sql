ALTER TABLE store_avatar_images DROP CONSTRAINT store_avatar_images_pkey;
ALTER TABLE store_avatar_images ADD PRIMARY KEY (store_id);

