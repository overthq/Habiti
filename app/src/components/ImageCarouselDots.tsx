import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, { interpolate } from 'react-native-reanimated';

interface ImageCarouselDotsProps {
	scrollX: Animated.SharedValue<number>;
	length: number;
}

const ImageCarouselDots: React.FC<ImageCarouselDotsProps> = ({
	scrollX,
	length
}) => {
	const { width } = useWindowDimensions();
	const thing = new Array(length).fill(0);
	const position = React.useMemo(() => scrollX.value / width, [scrollX, width]);

	return (
		<View>
			{thing.map((_, index) => {
				const width = interpolate(
					position,
					[index - 1, index, index + 1],
					[10, 30, 10]
				);
				return <Animated.View key={index} style={{ width }} />;
			})}
		</View>
	);
};

export default ImageCarouselDots;
