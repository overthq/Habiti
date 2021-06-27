export const STORE_IMAGE = `
	mutation StoreImage($input: images_insert_input!) {
		insert_images_one(object: $input) {
			id
		}
	}
`;
