import { useTheme } from '@habiti/components';
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler
} from 'react-native-reanimated';

import { ProductQuery } from '../../types/api';
import ImageCarouselDots from '../profile/ImageCarouselDots';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
	images: ProductQuery['product']['images'];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
	const scrollX = useSharedValue(0);
	const { theme } = useTheme();

	const handleScroll = useAnimatedScrollHandler({
		onScroll: ({ contentOffset: { x } }) => {
			scrollX.value = x;
		}
	});

	return (
		<View style={styles.container}>
			<Animated.ScrollView
				horizontal
				onScroll={handleScroll}
				decelerationRate='fast'
				scrollEventThrottle={16}
				snapToInterval={width}
				snapToAlignment='center'
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ flexGrow: 1 }}
				style={{ backgroundColor: theme.input.background }}
			>
				{images.map(image => (
					<Image
						key={image.id}
						source={{ uri: image.path }}
						style={styles.image}
					/>
				))}
			</Animated.ScrollView>
			<ImageCarouselDots scrollX={scrollX} length={images.length} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: width,
		width: '100%'
	},
	image: {
		width
	}
});

export default ImageCarousel;
