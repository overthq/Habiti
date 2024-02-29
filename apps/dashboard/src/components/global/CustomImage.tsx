import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface CustomImageProps {
	uri?: string;
	style?: ViewStyle;
	height?: number;
	width?: number;
}

const CustomImage: React.FC<CustomImageProps> = ({
	uri,
	height,
	width,
	style
}) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				{ width, height, backgroundColor: theme.image.placeholder },
				style
			]}
		>
			<Image style={styles.image} source={{ uri }} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		borderRadius: 4
	},
	image: {
		height: '100%',
		width: '100%'
	}
});

export default CustomImage;
