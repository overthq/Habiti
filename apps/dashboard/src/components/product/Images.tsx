import { useTheme, Icon, Typography } from '@habiti/components';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { ProductQuery } from '../../types/api';

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
	const { theme } = useTheme();

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
			<Typography
				weight='medium'
				style={[styles.title, { color: theme.input.label }]}
			>
				Images
			</Typography>
			<View style={styles.images}>
				{images?.map(({ id, path }) => (
					<Image key={id} source={{ uri: path }} style={styles.image} />
				))}
				{imagesToUpload.map(uri => (
					<Image key={uri} source={{ uri }} style={styles.image} />
				))}
				<TouchableOpacity
					onPress={handlePickImage}
					style={[styles.add, { borderColor: theme.border.color }]}
					activeOpacity={0.8}
				>
					<Icon name='plus' size={24} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	title: {
		marginBottom: 8
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
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Images;
