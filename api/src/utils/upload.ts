import cloudinary from 'cloudinary';
import { ReadStream } from 'fs';

// Thank you KeystoneJS and Sourcegraph!
export const uploadStream = (
	stream: ReadStream
): Promise<cloudinary.UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
			(error, result) => {
				if (error || !result) {
					return reject(error);
				}
				resolve(result);
			}
		);
		stream.pipe(cloudinaryStream);
	});
};

// TODO: Create helper for multiple file uploads.
