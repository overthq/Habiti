import { ImagePickerAsset } from 'expo-image-picker';
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
