export const CREATE_STORES = `
	mutation CreateStores($input: [stores_insert_input!]!) {
		insert_stores(objects: $input) {
			returning {
				id
			}
		}
	}
`;

export const CREATE_IMAGES = `
	mutation CreateImages($input: [images_insert_input!]!) {
		insert_images(objects: $input) {
			returning {
				id
			}
		}
	}
`;

export const CREATE_ITEMS = `
	mutation CreateItems($input: [items_insert_input!]!) {
		insert_items(objects: $input) {
			returning {
				id
			}
		}
	}
`;

export const CREATE_ITEM_IMAGES = `
	mutation CreateItemImages($input: [item_images_insert_input!]!) {
		insert_item_images(objects: $input) {
			returning {
				id
			}
		}
	}
`;

export const CREATE_USERS = `
	mutation CreateUsers($input: [users_insert_input!]!) {
		insert_users(objects: $input) {
			returning {
				id
			}
		}
	}
`;
