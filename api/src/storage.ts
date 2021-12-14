import { Request, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
import Busboy from 'busboy';
import './config/cloudinary';

const router = Router();
const prisma = new PrismaClient();

// Mostly copied from this gist:
// https://gist.github.com/sinnrrr/58901f7cdf77e299dc00ed23f362fcb8
const parseForm = (
	req: Request
): Promise<{
	body: Record<string, string>;
	uploads: cloudinary.UploadApiResponse[];
}> => {
	return new Promise((resolve, reject) => {
		const form = new Busboy({ headers: req.headers as any });

		let filesCount = 0;
		const body = {};
		const uploads: cloudinary.UploadApiResponse[] = [];

		const createUploader = () => {
			return cloudinary.v2.uploader.upload_stream((err, image) => {
				if (err) reject(err);
				else if (image) {
					uploads.push(image);

					if (filesCount === uploads.length) resolve({ body, uploads });
				}
			});
		};

		form.on('field', (fieldname, value) => {
			body[fieldname] = value;
		});

		form.on('file', (_fieldname, file) => {
			file.pipe(createUploader());
			file.on('end', () => {
				filesCount++;
			});
		});

		req.pipe(form);
	});
};

router.post('/upload', async (req, res) => {
	try {
		const {
			// body,
			uploads
		} = await parseForm(req);

		await prisma.image.create({
			data: {
				path: uploads[0].url
			}
		});

		// if (body.itemId) {
		// 	await client.request(STORE_ITEM_IMAGE, {
		// 		input: {
		// 			item_id: body.itemId,
		// 			image_id: insert_images_one.id,
		// 			order_place: 1
		// 		}
		// 	});
		// } else if (body.storeId) {
		// 	await client.request(STORE_STORE_IMAGE, {
		// 		input: {
		// 			store_id: body.storeId,
		// 			image_id: insert_images_one.id
		// 		}
		// 	});
		// }

		return res.status(201).json({
			success: true,
			message: 'Image successfully uploaded',
			uploads
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'An error occured while uploading/storing this image',
			error
		});
	}
});

export default router;
