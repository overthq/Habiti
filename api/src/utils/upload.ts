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

// const { createReadStream } = await imageFile;
// const stream = createReadStream();

// // Generate blurhash
// const chunks: Buffer[] = [];
// for await (const chunk of stream) {
// 	chunks.push(chunk);
// }
// const buffer = Buffer.concat(chunks);
// const { encode } = await import('blurhash');
// const sharp = (await import('sharp')).default;
// const { width, height, data } = await sharp(buffer)
// 	.raw()
// 	.ensureAlpha()
// 	.resize(32, 32, { fit: 'inside' })
// 	.toBuffer({ resolveWithObject: true });
// const blurhash = encode(new Uint8ClampedArray(data), width, height, 4, 4);

// // Reset stream for Cloudinary upload
// const newStream = new ReadStream();
// newStream.push(buffer);
// newStream.push(null);

// const uploadResult = await uploadStream(newStream);
// return { ...uploadResult, blurhash };
