import cloudinary from 'cloudinary';
import { Readable } from 'stream';

import { instrument } from './instrument';

export type AllowedMime =
	| 'image/jpeg'
	| 'image/png'
	| 'image/webp'
	| 'image/gif';

export const ALLOWED_MIME_TYPES: readonly AllowedMime[] = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_REQUEST = 8;
export const MAX_REQUEST_BODY = 60 * 1024 * 1024; // 60MB — overrides global 256KB cap.

// Thank you KeystoneJS and Sourcegraph!
export const uploadStream = (
	stream: Readable
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

export const uploadBuffer = (
	buffer: Buffer
): Promise<cloudinary.UploadApiResponse> => {
	return uploadStream(Readable.from(buffer));
};

// Workaround for Bun: upload_stream doesn't pass credentials properly.
// Use uploader.upload with a base64 data URI instead.

export const uploadBase64 = (
	buffer: Buffer,
	mime = 'image/jpeg'
): Promise<cloudinary.UploadApiResponse> => {
	const base64 = `data:${mime};base64,${buffer.toString('base64')}`;

	return instrument(
		'cloudinary',
		() =>
			cloudinary.v2.uploader.upload(base64, {
				resource_type: 'image'
			}),
		{ op: 'upload', mime, bytes: buffer.length }
	);
};

/**
 * Validates the file's content by reading the first 12 bytes ("magic
 * numbers") rather than trusting the browser-provided `file.type`.
 * Returns the actual MIME or `null` if it doesn't match an allowed format.
 */

export const sniffImageMime = (buf: Buffer): AllowedMime | null => {
	if (
		buf.length >= 3 &&
		buf[0] === 0xff &&
		buf[1] === 0xd8 &&
		buf[2] === 0xff
	) {
		return 'image/jpeg';
	}

	if (
		buf.length >= 8 &&
		buf[0] === 0x89 &&
		buf[1] === 0x50 &&
		buf[2] === 0x4e &&
		buf[3] === 0x47 &&
		buf[4] === 0x0d &&
		buf[5] === 0x0a &&
		buf[6] === 0x1a &&
		buf[7] === 0x0a
	) {
		return 'image/png';
	}

	if (
		buf.length >= 6 &&
		buf[0] === 0x47 &&
		buf[1] === 0x49 &&
		buf[2] === 0x46 &&
		buf[3] === 0x38 &&
		(buf[4] === 0x37 || buf[4] === 0x39) &&
		buf[5] === 0x61
	) {
		return 'image/gif';
	}

	if (
		buf.length >= 12 &&
		buf[0] === 0x52 &&
		buf[1] === 0x49 &&
		buf[2] === 0x46 &&
		buf[3] === 0x46 &&
		buf[8] === 0x57 &&
		buf[9] === 0x45 &&
		buf[10] === 0x42 &&
		buf[11] === 0x50
	) {
		return 'image/webp';
	}

	return null;
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
