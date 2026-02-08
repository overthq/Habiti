import multer from 'multer';

const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadImages = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_FILE_SIZE },
	fileFilter: (_req, file, cb) => {
		if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
		}
	}
});
