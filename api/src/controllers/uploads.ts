import { NextFunction, Request, Response } from 'express';

import { uploadBase64 } from '../utils/upload';
import { APIException } from '../types/errors';

export const uploadImages = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const files = req.files as Express.Multer.File[];

		if (!files || files.length === 0) {
			throw new APIException(400, 'No image files provided');
		}

		const uploads = await Promise.all(
			files.map(file => uploadBase64(file.buffer))
		);

		const images = uploads.map(result => ({
			url: result.secure_url,
			publicId: result.public_id
		}));

		return res.json({ images });
	} catch (error) {
		return next(error);
	}
};
