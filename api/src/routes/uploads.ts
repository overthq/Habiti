import { Hono } from 'hono';

import type { AppEnv } from '../types/hono';
import { authenticate } from '../middleware/auth';
import { uploadBase64 } from '../utils/upload';
import { APIException } from '../types/errors';

const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const uploads = new Hono<AppEnv>();

uploads.post('/images', authenticate, async c => {
	const body = await c.req.parseBody({ all: true });
	const rawFiles = body['images'];

	const files = Array.isArray(rawFiles) ? rawFiles : rawFiles ? [rawFiles] : [];
	const imageFiles = files.filter((f): f is File => f instanceof File);

	if (imageFiles.length === 0) {
		throw new APIException(400, 'No image files provided');
	}

	for (const file of imageFiles) {
		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			throw new APIException(
				400,
				'Only image files (JPEG, PNG, WebP, GIF) are allowed'
			);
		}
		if (file.size > MAX_FILE_SIZE) {
			throw new APIException(400, 'File size exceeds 10MB limit');
		}
	}

	const uploads = await Promise.all(
		imageFiles.map(async file => {
			const buffer = Buffer.from(await file.arrayBuffer());
			return uploadBase64(buffer);
		})
	);

	const images = uploads.map(result => ({
		url: result.secure_url,
		publicId: result.public_id
	}));

	return c.json({ images });
});

export default uploads;
