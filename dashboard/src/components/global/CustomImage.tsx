import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import useTheme from '../../hooks/useTheme';

interface CustomImageProps {
	uri?: string;
	size?: number;
	style?: ViewStyle;
}

const CustomImage: React.FC<CustomImageProps> = ({ uri, size, style }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				{ width: size, height: size, backgroundColor: theme.image.placeholder },
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
