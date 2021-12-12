import env from '../../env';
import * as FileSystem from 'expo-file-system';

interface UploadImagePayload {
	fileObject: FileSystem.FileInfo;
	metadata?: Record<string, string>;
}

// Sucks that expo-file-system only allows uploading one image at a time.
export const uploadImage = async ({
	fileObject,
	metadata
}: UploadImagePayload) => {
	try {
		const data = await FileSystem.uploadAsync(
			`${env.apiUrl}/storage/upload`,
			fileObject.uri,
			{
				httpMethod: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: 'Bearer'
				},
				fieldName: 'file',
				mimeType: `image/${fileObject.uri.substring(
					fileObject.uri.lastIndexOf('.') + 1
				)}`,
				parameters: metadata
			}
		);
		return data;
	} catch (error) {
		console.log(error);
	}
};
