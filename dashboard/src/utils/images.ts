import env from '../../env';
import * as FileSystem from 'expo-file-system';
import { ReactNativeFile } from 'extract-files';

export const generateUploadFile = (uri: string) => {
	return new ReactNativeFile({
		uri,
		type: 'image/jpeg',
		name: 'upload.jpg'
	});
};

export const uploadImage = async (
	uri: string,
	metadata?: Record<string, string>
) => {
	try {
		const data = await FileSystem.uploadAsync(
			`${env.apiUrl}/storage/upload`,
			uri,
			{
				httpMethod: 'POST',
				headers: { Authorization: 'Bearer' },
				uploadType: FileSystem.FileSystemUploadType.MULTIPART,
				fieldName: 'file',
				mimeType: `image/${uri.substring(uri.lastIndexOf('.') + 1)}`,
				parameters: metadata
			}
		);

		return data;
	} catch (error) {
		console.log(error);
	}
};
