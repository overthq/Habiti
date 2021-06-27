import env from '../../env';
import * as FileSystem from 'expo-file-system';

export const uploadImage = async (uri: string) => {
	try {
		const data = await FileSystem.uploadAsync(`${env.storageUrl}/upload`, uri, {
			httpMethod: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: 'Bearer'
			},
			fieldName: 'file',
			mimeType: `image/${uri.substring(uri.lastIndexOf('.') + 1)}`
		});

		return data;
	} catch (error) {
		console.log(error);
	}
};
