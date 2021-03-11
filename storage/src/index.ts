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

// This endpoint only supports uploading single images, until I can figure out how to upload multiple images at once using Expo's APIs.
// Also, it's interesting to try to get the number of images in the request and put it into the fileUpload.multiple? middleware.
// TODO: Run this service, and test the upload server.

app.use('/upload', fileUpload.single('image'), async (req, res) => {
	const data = await streamUpload(req);

	return res.status(201).json({
		success: true,
		message: 'Image successfully uploaded',
		data
	});
});

app.listen(Number(process.env.PORT));
