import express from 'express';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import multer from 'multer';
import './config';

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
	const data = await streamUpload(req);

	return res.status(201).json({
		success: true,
		message: 'Image successfully uploaded',
		data
	});
});

app.listen(Number(process.env.PORT));
