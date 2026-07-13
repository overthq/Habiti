import cloudinary from 'cloudinary';
import { env } from './env';

let configured = false;

export const getCloudinary = () => {
	if (!configured) {
		cloudinary.v2.config({
			cloud_name: env.CLOUDINARY_CLOUD_NAME,
			api_key: env.CLOUDINARY_API_KEY,
			api_secret: env.CLOUDINARY_API_SECRET
		});

		configured = true;
	}

	return cloudinary.v2;
};
