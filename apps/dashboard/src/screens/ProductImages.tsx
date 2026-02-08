import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Screen, TextButton } from '@habiti/components';
import * as ImagePicker from 'expo-image-picker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { ProductStackParamList } from '../types/navigation';
import { useUpdateProductMutation } from '../data/mutations';
import { uploadImage } from '../data/requests';
import FAB from '../components/products/FAB';

// TODO: Run a query here for this purpose
// Or use a context

const ProductImages: React.FC = () => {
	const [imagesToUpload, setImagesToUpload] = React.useState<
		ImagePicker.ImagePickerAsset[]
	>([]);
	const updateProductMutation = useUpdateProductMutation();

	const {
		params: { productId, images }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Images'>>();

	const { goBack, setOptions } = useNavigation();

	useGoBack();

	const handleSaveImages = React.useCallback(async () => {
		try {
			const uploaded = await Promise.all(
				imagesToUpload.map(a => uploadImage(a.uri))
			);

			const existingUrls = images?.map(i => i.path) ?? [];
			const newUrls = uploaded.map(u => u.url);

			await updateProductMutation.mutateAsync({
				productId,
				body: { images: [...existingUrls, ...newUrls] }
			});

			goBack();
		} catch (error) {
			console.log({ error });
		}
	}, [updateProductMutation, goBack, imagesToUpload, productId, images]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<TextButton
					disabled={imagesToUpload.length === 0}
					onPress={handleSaveImages}
				>
					Save
				</TextButton>
			)
		});
	}, [imagesToUpload]);

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});

		if (!result.canceled) {
			setImagesToUpload(prev => {
				const existingUris = new Set(prev.map(p => p.uri));
				const updatedAssets = result.assets.filter(
					a => !existingUris.has(a.uri)
				);
				return [...prev, ...updatedAssets];
			});
		}
	};

	return (
		<Screen style={styles.container}>
			<View style={styles.images}>
				{images?.map(({ id, path }) => (
					<Image key={id} source={{ uri: path }} style={styles.image} />
				))}
				{imagesToUpload.map(asset => (
					<Image
						key={asset.uri}
						source={{ uri: asset.uri }}
						style={styles.image}
					/>
				))}
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
	}
});

export default ProductImages;
