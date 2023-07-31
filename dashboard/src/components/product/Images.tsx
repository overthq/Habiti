import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProductQuery } from '../../types/api';
import { Icon } from '../Icon';

interface ImagesProps {
	images?: ProductQuery['product']['images'];
	imagesToUpload: string[];
	setImagesToUpload: React.Dispatch<React.SetStateAction<string[]>>;
}

const Images: React.FC<ImagesProps> = ({
	images,
	imagesToUpload,
	setImagesToUpload
}) => {
	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
			<Text style={styles.title}>Images</Text>
			<View style={styles.images}>
				{images?.map(({ id, path }) => (
					<Image key={id} source={{ uri: path }} style={styles.image} />
				))}
				{imagesToUpload.map(uri => (
					<Image key={uri} source={{ uri }} style={styles.image} />
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
		marginBottom: 8,
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
		borderRadius: 6,
		borderColor: '#E3E3E3',
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Images;
