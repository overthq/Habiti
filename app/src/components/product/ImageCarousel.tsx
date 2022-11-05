import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler
} from 'react-native-reanimated';
import ImageCarouselDots from '../profile/ImageCarouselDots';
import { ProductQuery } from '../../types/api';

interface ImageCarouselProps {
	images: ProductQuery['product']['images'];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
	const { width } = useWindowDimensions();
	const scrollX = useSharedValue(0);

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
			>
				{images.map(image => (
					<View key={image.id} style={styles.imageContainer}>
						<Image source={{ uri: image.path }} style={styles.image} />
					</View>
				))}
			</Animated.ScrollView>
			<ImageCarouselDots scrollX={scrollX} length={images.length} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 300,
		width: '100%',
		backgroundColor: '#FFFFFF'
	},
	imageContainer: {
		width: '100%',
		height: '100%'
	},
	image: {
		width: '100%',
		height: '100%'
	}
});

export default ImageCarousel;
