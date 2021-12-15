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
import ImageCarouselDots from '../ImageCarouselDots';
import { ProductQuery } from '../../types/api';

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
				style={{ height: '100%', width: '100%' }}
				keyExtractor={(i: any) => i.id}
				renderItem={({ item }: any) => (
					<View style={{ width: '100%', height: '100%' }}>
						{/*<Image
							source={{ uri: item.path }}
							style={{ width: '100%', height: '100%' }}
						/>*/}
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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 400,
		width: '100%',
		backgroundColor: '#D3D3D3'
	}
});

export default ImageCarousel;
