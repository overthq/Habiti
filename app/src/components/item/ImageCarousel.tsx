import React from 'react';
import { View, Image, FlatList, useWindowDimensions } from 'react-native';
import {
	useSharedValue,
	useAnimatedScrollHandler
} from 'react-native-reanimated';

interface ImageCarouselProps {
	images: any[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
	const { width } = useWindowDimensions();
	const scrollX = useSharedValue(0);
	const [slideIndex, setSlideIndex] = React.useState(0);

	const handleViewableItemsChanged = React.useCallback(({ viewableItems }) => {
		if (!viewableItems[0]) return;
		setSlideIndex(viewableItems[0].index);
	}, []);

	const handleScroll = useAnimatedScrollHandler({
		onScroll: ({ contentOffset: { x } }) => {
			scrollX.value = x;
		}
	});

	return (
		<View>
			<FlatList
				data={images}
				keyExtractor={i => i.place_order}
				renderItem={({ item }) => (
					<Image source={{ uri: item.image.path_url }} />
				)}
				horizontal
				decelerationRate='fast'
				onViewableItemsChanged={handleViewableItemsChanged}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				snapToInterval={width}
				snapToAlignment='center'
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};

export default ImageCarousel;
