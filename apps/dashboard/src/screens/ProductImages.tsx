import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Icon } from '@habiti/components';
import * as ImagePicker from 'expo-image-picker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { ProductStackParamList } from '../types/navigation';

const ProductImages: React.FC = () => {
	const [imagesToUpload, setImagesToUpload] = React.useState<string[]>([]);

	// TODO: Run a query here for this purpose
	// Or use a context
	const {
		params: { images }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Images'>>();

	const { setOptions } = useNavigation();

	useGoBack();

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<Pressable onPress={handlePickImage}>
					<Icon name='plus' size={24} />
				</Pressable>
			)
		});
	}, []);

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});

		if (!result.canceled) {
			setImagesToUpload(x => [...x, ...result.assets.map(x => x.uri)]);
		}
	};

	return (
		<View style={styles.section}>
			<View style={styles.images}>
				{images?.map(({ id, path }) => (
					<Image key={id} source={{ uri: path }} style={styles.image} />
				))}
				{imagesToUpload.map(uri => (
					<Image key={uri} source={{ uri }} style={styles.image} />
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
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
