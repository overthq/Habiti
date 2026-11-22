import { ImagePickerAsset } from 'expo-image-picker';
import { uploadImages } from '@habiti/data';
import { ReactNativeFile } from './upload';

// FIXME: Maybe just failing when mimeType is not passed is okay?
// Generate a nice name for the asset, maybe tied to the userId and time?

export const generateUploadFile = (asset: ImagePickerAsset) => {
	return new ReactNativeFile({
		uri: asset.uri,
		type: asset.mimeType || 'image/jpeg',
		name: asset.fileName || 'upload.jpg'
	});
};

export const uploadImage = async (uri: string) => {
	const filename = uri.split('/').pop() ?? 'image.jpg';
	const match = /\.(\w+)$/.exec(filename);
	const type = match ? `image/${match[1]}` : 'image/jpeg';

	const formData = new FormData();
	formData.append('images', { uri, name: filename, type } as any);

	const { images } = await uploadImages(formData);
	return images[0];
};
