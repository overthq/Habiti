import cloudinary from 'cloudinary';
import { env } from './env';

let configured = false;

export const getCloudinary = () => {
	if (!configured) {
		const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
			env;

		if (
			!CLOUDINARY_CLOUD_NAME ||
			!CLOUDINARY_API_KEY ||
			!CLOUDINARY_API_SECRET
		) {
			throw new Error('Cloudinary is not configured');
		}

		cloudinary.v2.config({
			cloud_name: CLOUDINARY_CLOUD_NAME,
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_API_SECRET
		});

		configured = true;
	}

	return cloudinary.v2;
};
