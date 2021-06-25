import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ItemDetailsFragment } from '../../types/api';
import { Icon } from '../icons';

interface ImagesProps {
	images: ItemDetailsFragment['item_images'];
}

const Images: React.FC<ImagesProps> = ({ images }) => {
	return (
		<View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Images</Text>
				{images.map(({ image }) => (
					<Image key={image.id} source={{ uri: image.path_url }} />
				))}
				<TouchableOpacity style={styles.add}>
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
	sectionTitle: {
		marginBottom: 4,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	add: {
		width: 80,
		height: 80,
		borderRadius: 6,
		borderColor: '#D3D3D3',
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Images;
