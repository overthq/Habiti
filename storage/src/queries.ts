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
