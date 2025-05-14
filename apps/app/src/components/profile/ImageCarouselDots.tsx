import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle,
	useDerivedValue
} from 'react-native-reanimated';

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

export default ImageCarouselDots;
