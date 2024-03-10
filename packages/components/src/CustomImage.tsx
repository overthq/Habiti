import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

import { useTheme } from './Theme';

interface CustomImageProps {
	uri?: string;
	style?: ViewStyle;
	height?: number;
	width?: number;
	circle?: boolean;
}

const CustomImage: React.FC<CustomImageProps> = ({
	uri,
	height,
	width,
	style,
	circle
}) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				{
					width,
					height,
					backgroundColor: theme.image.placeholder,
					borderRadius: circle ? height / 2 : 4
				},
				style
			]}
		>
			<Image style={styles.image} source={{ uri }} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden'
	},
	image: {
		height: '100%',
		width: '100%'
	}
});

export default CustomImage;
