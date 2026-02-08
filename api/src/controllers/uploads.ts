import { NextFunction, Request, Response } from 'express';
import cloudinary from 'cloudinary';

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
			files.map(file => uploadBuffer(file.buffer))
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

const uploadBuffer = (
	buffer: Buffer
): Promise<cloudinary.UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
			if (error || !result) {
				return reject(error);
			}
			resolve(result);
		});
		stream.end(buffer);
	});
};
