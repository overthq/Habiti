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

// TODO: Refactor:
// - When there is no productId, we should store the picked images somewhere
//   in state. We may also choose to store optimistic products (drafts) in the database.
//   However, that will get increasingly complicated.
// - This potential "imageFiles" array will/should be populated for edit/add products,
//   and the images will be batch sent once the "Save" button is pressed.
// - Should be relatively easy to implement.
// - Other good thing about this is that it technically means we will be doing batch uploads.
// - Somewhat funny that I will probably start using Zustand a lot more for things like this.
// Ideally, we should not upload images immediately after they are picked.

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

		if (!result.cancelled) {
			console.log('[populated]');
			setImagesToUpload(x => [...x, result.uri]);
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
