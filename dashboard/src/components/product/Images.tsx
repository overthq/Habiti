import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProductQuery, useEditProductMutation } from '../../types/api';
import { Icon } from '../icons';
import { generateUploadFile } from '../../utils/images';

interface ImagesProps {
	productId: string;
	images: ProductQuery['product']['images'];
}

const Images: React.FC<ImagesProps> = ({ productId, images }) => {
	const [, editProduct] = useEditProductMutation();
	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});

		if (!result.cancelled) {
			const imageFile = generateUploadFile(result.uri);

			await editProduct({ id: productId, input: { imageFile } });
		}
	};

	return (
		<View style={styles.section}>
			<Text style={styles.title}>Images</Text>
			<View style={styles.images}>
				{images.map(({ id, path }) => (
					<Image key={id} source={{ uri: path }} style={styles.image} />
				))}
				<TouchableOpacity onPress={handlePickImage} style={styles.add}>
					<Icon name='plus' size={24} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	title: {
		marginBottom: 4,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	images: {
		width: '100%',
		flexDirection: 'row'
	},
	image: {
		height: 60,
		width: 60,
		borderRadius: 4,
		marginRight: 8
	},
	add: {
		width: 60,
		height: 60,
		borderRadius: 4,
		borderColor: '#D3D3D3',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Images;