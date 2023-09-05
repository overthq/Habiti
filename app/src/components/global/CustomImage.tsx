import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

interface CustomImageProps {
	uri?: string;
	size?: number;
	style?: ViewStyle;
}

const CustomImage: React.FC<CustomImageProps> = ({ uri, size, style }) => {
	return (
		<View style={[styles.container, { width: size, height: size }, style]}>
			<Image style={styles.image} source={{ uri }} />
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
