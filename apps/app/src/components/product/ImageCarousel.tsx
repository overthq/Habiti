import { useTheme } from '@habiti/components';
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedScrollHandler
} from 'react-native-reanimated';

import ImageCarouselDots from './ImageCarouselDots';
import { useProductContext } from './ProductContext';

const { width } = Dimensions.get('window');

const ImageCarousel: React.FC = () => {
	const scrollX = useSharedValue(0);
	const { theme } = useTheme();
	const {
		product: { images }
	} = useProductContext();

	const handleScroll = useAnimatedScrollHandler({
		onScroll: ({ contentOffset: { x } }) => {
			scrollX.value = x;
		}
	});

	if (images.length === 0 || images.length === 1) {
		return (
			<View
				style={[styles.container, { backgroundColor: theme.input.background }]}
			>
				<Image source={{ uri: images[0]?.path }} style={styles.image} />
			</View>
		);
	}

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
