export const STORE_IMAGE = `
	mutation StoreImage($input: images_insert_input!) {
		insert_images_one(object: $input) {
			id
		}
	}
`;

export const STORE_ITEM_IMAGE = `
	mutation StoreItemImage($input: item_images_insert_input!) {
		insert_item_images_one(object: $input) {
			item_id
			image_id
			order_place
		}
	}
`;

export const STORE_STORE_IMAGE = `
	mutation StoreStoreImage($input: store_avatar_images_insert_input!) {
		insert_store_avatar_images_one(object: $input) {
			store_id
			image_id
		}
	}
`;
