import env from '../../env';
import * as FileSystem from 'expo-file-system';

interface UploadImagePayload {
	fileObject: FileSystem.FileInfo;
}

export const uploadImage = async ({ fileObject }: UploadImagePayload) => {
	try {
		const data = await FileSystem.uploadAsync(
			`${env.storageUrl}/upload`,
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
				)}`
			}
		);
		return data;
	} catch (error) {
		console.log(error);
	}
};
