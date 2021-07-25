import env from '../../env';
import * as FileSystem from 'expo-file-system';

export const uploadImage = async (
	uri: string,
	metadata?: Record<string, string>
) => {
	try {
		const data = await FileSystem.uploadAsync(`${env.storageUrl}/upload`, uri, {
			httpMethod: 'POST',
			headers: {
				// 'Content-Type': 'multipart/form-data',
				Authorization: 'Bearer'
			},
			uploadType: FileSystem.FileSystemUploadType.MULTIPART,
			fieldName: 'file',
			mimeType: `image/${uri.substring(uri.lastIndexOf('.') + 1)}`,
			parameters: metadata
		});

		return data;
	} catch (error) {
		console.log(error);
	}
};
