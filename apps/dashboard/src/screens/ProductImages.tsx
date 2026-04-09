import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { HeaderButton } from '@react-navigation/elements';
import { Screen, Typography } from '@habiti/components';
import * as ImagePicker from 'expo-image-picker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { AppStackParamList } from '../navigation/types';
import { useUpdateProductMutation } from '../data/mutations';
import { uploadImage } from '../data/requests';
import FAB from '../components/products/FAB';

interface UploadedImage {
	url: string;
	publicId: string;
	previewUri: string;
}

const ProductImages = () => {
	const [uploadedImages, setUploadedImages] = React.useState<UploadedImage[]>(
		[]
	);
	const [uploading, setUploading] = React.useState(false);
	const updateProductMutation = useUpdateProductMutation();

	const {
		params: { productId, images }
	} = useRoute<RouteProp<AppStackParamList, 'Modal.EditProductImages'>>();

	const { goBack, setOptions } = useNavigation();

	const handleSaveImages = React.useCallback(async () => {
		try {
			const existingImages =
				images?.map(i => ({ path: i.path, publicId: i.publicId })) ?? [];
			const newImages = uploadedImages.map(u => ({
				path: u.url,
				publicId: u.publicId
			}));

			await updateProductMutation.mutateAsync({
				productId,
				body: { images: [...existingImages, ...newImages] }
			});

			goBack();
		} catch (error) {
			console.log({ error });
		}
	}, [updateProductMutation, goBack, uploadedImages, productId, images]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton
					disabled={
						uploadedImages.length === 0 ||
						uploading ||
						updateProductMutation.isPending
					}
					onPress={handleSaveImages}
				>
					{updateProductMutation.isPending ? (
						<ActivityIndicator />
					) : (
						<Typography>Save</Typography>
					)}
				</HeaderButton>
			)
		});
	}, [uploadedImages, uploading, updateProductMutation.isPending]);

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8
		});

		if (result.canceled) return;

		const asset = result.assets[0];

		try {
			setUploading(true);
			const { url, publicId } = await uploadImage(asset.uri);
			setUploadedImages(prev => [
				...prev,
				{ url, publicId, previewUri: asset.uri }
			]);
		} catch (error) {
			console.log('Image upload failed:', error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<Screen style={styles.container}>
			<View style={styles.images}>
				{images?.map(({ id, path }) => (
					<Image
						key={id}
						source={{ uri: path.replace('http://', 'https://') }}
						style={styles.image}
					/>
				))}
				{uploadedImages.map(img => (
					<Image
						key={img.publicId}
						source={{ uri: img.previewUri }}
						style={styles.image}
					/>
				))}
				{uploading && (
					<View style={[styles.image, styles.uploadingPlaceholder]}>
						<ActivityIndicator />
					</View>
				)}
			</View>
			<FAB onPress={handlePickImage} text='Add new image' />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	images: {
		width: '100%',
		flexDirection: 'row'
	},
	image: {
		height: 80,
		width: 80,
		borderRadius: 4,
		marginRight: 8
	},
	uploadingPlaceholder: {
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default ProductImages;
