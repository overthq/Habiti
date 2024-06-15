import { ReactNativeFile } from './upload';

export const generateUploadFile = (uri: string) => {
	return new ReactNativeFile({
		uri,
		type: 'image/jpeg',
		name: 'upload.jpg'
	});
};
