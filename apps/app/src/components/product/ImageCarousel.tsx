import { useTheme } from '@habiti/components';
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue
} from 'react-native-reanimated';

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
						source={{ uri: image.path.replace('http://', 'https://') }}
						style={styles.image}
					/>
				))}
			</Animated.ScrollView>
			<ImageCarouselDots scrollX={scrollX} length={images.length} />
		</View>
	);
};

interface ImageCarouselDotsProps {
	scrollX: SharedValue<number>;
	length: number;
}

const Dot = ({
	index,
	position
}: {
	index: number;
	position: SharedValue<number>;
}) => {
	const style = useAnimatedStyle(() => {
		return {
			width: interpolate(
				position.value,
				[index - 1, index, index + 1],
				[10, 30, 10]
			),
			opacity: interpolate(
				position.value,
				[index - 1, index, index + 1],
				[0.5, 1, 0.5]
			)
		};
	});

	return (
		<Animated.View
			style={[
				{
					height: 4,
					borderRadius: 100,
					backgroundColor: '#FFFFFF'
				},
				style
			]}
		/>
	);
};

const ImageCarouselDots: React.FC<ImageCarouselDotsProps> = ({
	scrollX,
	length
}) => {
	const { width } = useWindowDimensions();
	const thing = new Array(length).fill(0);
	const position = useDerivedValue(() => scrollX.value / width);

	return (
		<View
			style={{
				flexDirection: 'row',
				gap: 4,
				alignItems: 'center',
				position: 'absolute',
				bottom: 16,
				alignSelf: 'center'
			}}
		>
			{thing.map((_, index) => {
				return <Dot key={index} index={index} position={position} />;
			})}
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
