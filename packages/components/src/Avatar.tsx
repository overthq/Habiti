import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

import { useTheme } from './Theme';
import Typography from './Typography';

interface AvatarProps {
	uri?: string;
	style?: ViewStyle;
	size?: number;
	fallbackText?: string;
	circle?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
	uri,
	size = 40,
	style,
	fallbackText,
	circle = true
}) => {
	const { theme } = useTheme();
	const [imageError, setImageError] = React.useState(false);

	const showFallback = !uri || imageError;

	const getFallbackText = () => {
		if (!fallbackText) return '';

		const words = fallbackText.trim().split(' ');
		if (words.length === 1) {
			return words[0].charAt(0).toUpperCase();
		}
		return words
			.slice(0, 2)
			.map(word => word.charAt(0).toUpperCase())
			.join('');
	};

	const fontSize = React.useMemo(() => Math.floor(size * 0.4), [size]);

	return (
		<View
			style={[
				styles.container,
				{
					width: size,
					height: size,
					backgroundColor: theme.image.placeholder,
					borderRadius: circle ? size / 2 : 4
				},
				style
			]}
		>
			{showFallback ? (
				<View style={styles.fallback}>
					<Typography variant='secondary' weight='medium' style={{ fontSize }}>
						{getFallbackText()}
					</Typography>
				</View>
			) : (
				<Image
					style={styles.image}
					source={{ uri }}
					onError={() => setImageError(true)}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		height: '100%',
		width: '100%'
	},
	fallback: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%'
	}
});

export default Avatar;
