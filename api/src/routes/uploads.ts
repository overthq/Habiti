import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { HTTPException } from 'hono/http-exception';

import { authenticate } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import {
	ALLOWED_MIME_TYPES,
	type AllowedMime,
	MAX_FILE_SIZE,
	MAX_FILES_PER_REQUEST,
	MAX_REQUEST_BODY,
	sniffImageMime,
	uploadBase64
} from '../utils/upload';

import type { AppEnv } from '../types/hono';

const uploads = new Hono<AppEnv>();

uploads.use(
	'*',
	rateLimit({
		prefix: 'uploads',
		windowSec: 3600,
		limit: 30,
		keyGenerator: c =>
			c.var.auth?.id ?? c.req.header('x-forwarded-for') ?? 'anon'
	})
);

uploads.post(
	'/images',
	authenticate,
	bodyLimit({
		maxSize: MAX_REQUEST_BODY,
		onError: c => c.json({ message: 'Payload too large' }, 413)
	}),
	async c => {
		const body = await c.req.parseBody({ all: true });
		const rawFiles = body['images'];

		const files = Array.isArray(rawFiles)
			? rawFiles
			: rawFiles
				? [rawFiles]
				: [];
		const imageFiles = files.filter((f): f is File => f instanceof File);

		if (imageFiles.length === 0) {
			throw new HTTPException(400, { message: 'No image files provided' });
		}

		if (imageFiles.length > MAX_FILES_PER_REQUEST) {
			throw new HTTPException(400, {
				message: `At most ${MAX_FILES_PER_REQUEST} files per request`
			});
		}

		// Pre-flight: cheap header checks before reading the bodies.
		for (const file of imageFiles) {
			if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMime)) {
				throw new HTTPException(400, {
					message: 'Only image files (JPEG, PNG, WebP, GIF) are allowed'
				});
			}

			if (file.size > MAX_FILE_SIZE) {
				throw new HTTPException(400, {
					message: 'File size exceeds 10MB limit'
				});
			}
		}

		// Read buffers and verify magic bytes; reject anything that doesn't
		// actually match its claimed type.
		const buffers = await Promise.all(
			imageFiles.map(async file => {
				const buffer = Buffer.from(await file.arrayBuffer());
				const sniffed = sniffImageMime(buffer);

				if (!sniffed) {
					throw new HTTPException(400, {
						message: 'File contents do not match an allowed image format'
					});
				}

				return { buffer, mime: sniffed };
			})
		);

		const uploads = await Promise.all(
			buffers.map(({ buffer, mime }) => uploadBase64(buffer, mime))
		);

		const images = uploads.map(result => ({
			url: result.secure_url,
			publicId: result.public_id
		}));

		return c.json({ images });
	}
);

export default uploads;
