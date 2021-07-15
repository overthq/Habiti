import express from 'express';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import multer from 'multer';
import client from './client';
import './config';
import { STORE_IMAGE } from './queries';

const app = express();

app.use(express.json());

const fileUpload = multer();

const streamUpload = (req: express.Request) =>
	new Promise((resolve, reject) => {
		const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
			if (result) {
				resolve(result);
			} else {
				reject(error);
			}
		});

		streamifier.createReadStream(req.file.buffer).pipe(stream);
	});

app.use('/upload', fileUpload.single('image'), async (req, res) => {
	try {
		const data = await streamUpload(req);

		await client.request(STORE_IMAGE, {
			input: {
				path_url: ''
			}
		});

		return res.status(201).json({
			success: true,
			message: 'Image successfully uploaded',
			data
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'An error occured while uploading/storing this image',
			error
		});
	}
});

app.listen(Number(process.env.PORT));
