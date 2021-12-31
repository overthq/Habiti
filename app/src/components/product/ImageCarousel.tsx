import React from 'react';
import {
	View,
	Image,
	FlatList,
	StyleSheet,
	useWindowDimensions
} from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler
} from 'react-native-reanimated';
import ImageCarouselDots from '../profile/ImageCarouselDots';
import { ProductQuery } from '../../types/api';
import CloseButton from './CloseButton';

interface ImageCarouselProps {
	images: ProductQuery['product']['images'];
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
			<AnimatedFlatList
				data={images}
				contentContainerStyle={{ flex: 1 }}
				keyExtractor={(i: any) => i.id}
				renderItem={({ item }: any) => (
					<View style={styles.imageContainer}>
						<Image source={{ uri: item.path }} style={styles.image} />
					</View>
				)}
				horizontal
				decelerationRate='fast'
				onScroll={handleScroll}
				scrollEventThrottle={16}
				snapToInterval={width}
				snapToAlignment='center'
				showsHorizontalScrollIndicator={false}
			/>
			<ImageCarouselDots scrollX={scrollX} length={images.length} />
			<CloseButton />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 400,
		width: '100%',
		backgroundColor: '#D3D3D3'
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
