import React from 'react';
import {
	View,
	Image,
	StyleSheet,
	Dimensions,
	useWindowDimensions,
	Pressable,
	ScrollView
} from 'react-native';
import {
	Button,
	CustomImage,
	Icon,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { formatNaira } from '@habiti/common';
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue
} from 'react-native-reanimated';

import {
	ProductProvider,
	useProductContext
} from '../components/ProductContext';
import { AppStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

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

interface ImageCarouselDotsProps {
	scrollX: SharedValue<number>;
	length: number;
}

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
				style={[
					styles.carouselContainer,
					{ backgroundColor: theme.input.background }
				]}
			>
				<Image
					source={{ uri: images[0]?.path.replace('http://', 'https://') }}
					style={styles.carouselImage}
				/>
			</View>
		);
	}

	return (
		<View style={styles.carouselContainer}>
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
						style={styles.carouselImage}
					/>
				))}
			</Animated.ScrollView>
			<ImageCarouselDots scrollX={scrollX} length={images.length} />
		</View>
	);
};

const ProductDetails: React.FC = () => {
	const { product } = useProductContext();

	return (
		<View style={styles.detailsContainer}>
			<Typography size='xxlarge' weight='bold'>
				{product.name}
			</Typography>
			<Spacer y={2} />
			<Typography size='xlarge' weight='medium' variant='secondary'>
				{formatNaira(product.unitPrice)}
			</Typography>
			<Spacer y={12} />
			<Typography variant='label' weight='medium'>
				Description
			</Typography>
			<Spacer y={4} />
			<Typography>{product?.description}</Typography>
		</View>
	);
};

const RelatedProducts: React.FC = () => {
	const { relatedProducts } = useProductContext();
	// @ts-expect-error - push is a valid navigation prop
	const { push } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<View style={styles.relatedContainer}>
			<Typography variant='label' weight='medium' style={{ marginLeft: 16 }}>
				Related products
			</Typography>
			<Spacer y={8} />
			<ScrollView
				contentContainerStyle={styles.relatedScroll}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{relatedProducts.map(product => (
					<Pressable
						key={product.id}
						onPress={() => push('Product', { productId: product.id })}
					>
						<CustomImage
							uri={product.images[0]?.path}
							height={120}
							width={120}
						/>
						<Spacer y={4} />
						<Typography weight='medium' style={{ fontSize: 14 }}>
							{product.name}
						</Typography>
						<Typography
							weight='medium'
							variant='secondary'
							style={{ fontSize: 14 }}
						>
							{formatNaira(product.unitPrice)}
						</Typography>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);
};

const QuantityControl: React.FC = () => {
	const { quantity, setQuantity } = useProductContext();
	const { theme } = useTheme();

	const decrementDisabled = React.useMemo(() => quantity === 1, [quantity]);

	// TODO: We want this to be disabled when the product is out of stock.
	const incrementDisabled = false;

	const increment = React.useCallback(() => setQuantity(q => q + 1), []);
	const decrement = React.useCallback(() => setQuantity(q => q - 1), []);

	return (
		<View
			style={[
				styles.quantityControls,
				{ backgroundColor: theme.input.background }
			]}
		>
			<Pressable hitSlop={16} disabled={decrementDisabled} onPress={decrement}>
				<Icon name='minus' color={theme.text.secondary} />
			</Pressable>
			<Typography size='large' weight='medium' number>
				{quantity}
			</Typography>
			<Pressable hitSlop={16} disabled={incrementDisabled} onPress={increment}>
				<Icon name='plus' color={theme.text.secondary} />
			</Pressable>
		</View>
	);
};

const CartButton: React.FC = () => {
	const {
		onCartCommit,
		cartCommitDisabled,
		cartCommitText,
		cartCommitFetching
	} = useProductContext();

	return (
		<Button
			loading={cartCommitFetching}
			onPress={onCartCommit}
			text={cartCommitText}
			disabled={cartCommitDisabled}
			style={styles.cartButton}
		/>
	);
};

const AddToCart: React.FC = () => {
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	return (
		<View
			style={[
				styles.addToCartContainer,
				{
					backgroundColor: theme.screen.background,
					paddingBottom: bottom,
					borderTopColor: theme.border.color
				}
			]}
		>
			<QuantityControl />
			<CartButton />
		</View>
	);
};

const Product = () => {
	return (
		<ProductProvider>
			<ScrollableScreen
				contentContainerStyle={{ padding: 0 }}
				showsVerticalScrollIndicator={false}
			>
				<ImageCarousel />
				<Spacer y={16} />
				<ProductDetails />
				<Spacer y={16} />
				<RelatedProducts />
				<Spacer y={16} />
			</ScrollableScreen>
			<AddToCart />
		</ProductProvider>
	);
};

const styles = StyleSheet.create({
	carouselContainer: {
		height: width,
		width: '100%'
	},
	carouselImage: {
		width,
		height: '100%'
	},
	detailsContainer: {
		paddingHorizontal: 16
	},
	relatedContainer: {
		flex: 1
	},
	relatedScroll: {
		paddingHorizontal: 16,
		gap: 12
	},
	addToCartContainer: {
		flexDirection: 'row',
		gap: 16,
		padding: 16,
		paddingBottom: 8,
		borderTopWidth: 0.5,
		bottom: 0
	},
	quantityControls: {
		width: (width - 16 * 3) / 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 6,
		paddingHorizontal: 16
	},
	cartButton: {
		width: (width - 16 * 3) / 2
	}
});

export default Product;
