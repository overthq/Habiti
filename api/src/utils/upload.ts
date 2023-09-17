import cloudinary from 'cloudinary';
import { ReadStream } from 'fs-capacitor';
import { FileUpload } from 'graphql-upload';

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

export const uploadImages = async (imageFiles: Promise<FileUpload>[]) => {
	return await Promise.all(imageFiles.map(uploadImage));
};

export const uploadImage = async (imageFile: Promise<FileUpload>) => {
	return uploadStream((await imageFile).createReadStream());
};
