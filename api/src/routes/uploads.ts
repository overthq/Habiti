import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';

import type { AppEnv } from '../types/hono';
import { authenticate } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { uploadBase64 } from '../utils/upload';
import { APIException } from '../types/errors';

type AllowedMime = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

const ALLOWED_MIME_TYPES: readonly AllowedMime[] = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES_PER_REQUEST = 8;
const MAX_REQUEST_BODY = 60 * 1024 * 1024; // 60MB — overrides global 256KB cap.

/**
 * Validates the file's content by reading the first 12 bytes ("magic
 * numbers") rather than trusting the browser-provided `file.type`.
 * Returns the actual MIME or `null` if it doesn't match an allowed format.
 */
const sniffImageMime = (buf: Buffer): AllowedMime | null => {
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
			throw new APIException(400, 'No image files provided');
		}

		if (imageFiles.length > MAX_FILES_PER_REQUEST) {
			throw new APIException(
				400,
				`At most ${MAX_FILES_PER_REQUEST} files per request`
			);
		}

		// Pre-flight: cheap header checks before reading the bodies.
		for (const file of imageFiles) {
			if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMime)) {
				throw new APIException(
					400,
					'Only image files (JPEG, PNG, WebP, GIF) are allowed'
				);
			}
			if (file.size > MAX_FILE_SIZE) {
				throw new APIException(400, 'File size exceeds 10MB limit');
			}
		}

		// Read buffers and verify magic bytes; reject anything that doesn't
		// actually match its claimed type.
		const buffers = await Promise.all(
			imageFiles.map(async file => {
				const buffer = Buffer.from(await file.arrayBuffer());
				const sniffed = sniffImageMime(buffer);
				if (!sniffed) {
					throw new APIException(
						400,
						'File contents do not match an allowed image format'
					);
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
