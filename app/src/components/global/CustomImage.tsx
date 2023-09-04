import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

interface CustomImageProps {
	path?: string;
	style?: ViewStyle;
}

const CustomImage: React.FC<CustomImageProps> = ({ path, style }) => {
	return (
		<View style={[styles.container, style]}>
			<Image style={styles.image} source={{ uri: path }} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#D3D3D3',
		overflow: 'hidden'
	},
	image: {
		height: '100%',
		width: '100%'
	}
});

export default CustomImage;
