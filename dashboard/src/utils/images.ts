import { ReactNativeFile } from 'extract-files';

export const generateUploadFile = (uri: string) => {
	return new ReactNativeFile({
		uri,
		type: 'image/jpeg',
		name: 'upload.jpg'
	});
};
