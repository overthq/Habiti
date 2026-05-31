import React from 'react';
import {
	View,
	Image,
	StyleSheet,
	Dimensions,
	useWindowDimensions,
	Pressable,
	ScrollView,
	Share
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
import { HeaderButton, useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { formatNaira } from '@habiti/common';

import {
	ProductProvider,
	useProductContext
} from '../components/ProductContext';
import { AppStackParamList } from '../navigation/types';
import { getFrontendUrl } from '../utils/links';

const { width } = Dimensions.get('window');

const SCREEN_PADDING = 16;
const CAROUSEL_GAP = 12;
const CAROUSEL_SLIVER = 8;
const CAROUSEL_RADIUS = 8;

const ImageCarousel: React.FC = () => {
	const { theme } = useTheme();
	const {
		product: { images }
	} = useProductContext();
	const { width: screenWidth } = useWindowDimensions();

	if (images.length <= 1) {
		return (
			<View
				style={[
					styles.carouselSingle,
					{ backgroundColor: theme.input.background }
				]}
			>
				{images[0] && (
					<Image
						source={{ uri: images[0].path.replace('http://', 'https://') }}
						style={styles.carouselSingleImage}
					/>
				)}
			</View>
		);
	}

	const itemWidth =
		screenWidth - SCREEN_PADDING - CAROUSEL_GAP - CAROUSEL_SLIVER;

	return (
		<View
			style={[styles.carouselContainer, { marginHorizontal: -SCREEN_PADDING }]}
		>
			<ScrollView
				horizontal
				decelerationRate='fast'
				snapToInterval={itemWidth + CAROUSEL_GAP}
				snapToAlignment='start'
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: SCREEN_PADDING,
					gap: CAROUSEL_GAP
				}}
			>
				{images.map(image => (
					<Image
						key={image.id}
						source={{ uri: image.path.replace('http://', 'https://') }}
						style={{
							width: itemWidth,
							height: '100%',
							borderRadius: CAROUSEL_RADIUS,
							backgroundColor: theme.input.background
						}}
					/>
				))}
			</ScrollView>
		</View>
	);
};

const ProductDetails: React.FC = () => {
	const { product } = useProductContext();

	return (
		<View>
			<Typography size='xxlarge' weight='medium'>
				{product.name}
			</Typography>

			<Spacer y={2} />

			<Typography size='xlarge' weight='medium' variant='secondary'>
				{formatNaira(product.unitPrice)}
			</Typography>

			<Spacer y={12} />

			<Typography size='small' variant='label' weight='medium'>
				Description
			</Typography>

			<Spacer y={4} />

			<Typography>{product?.description}</Typography>
		</View>
	);
};

const RELATED_GAP = 12;
const RELATED_SLIVER = 12;
const RELATED_PADDING = 16;

const RelatedProducts: React.FC = () => {
	const { relatedProducts } = useProductContext();
	const { width: windowWidth } = useWindowDimensions();
	// @ts-expect-error - push is a valid navigation prop
	const { push } = useNavigation<NavigationProp<AppStackParamList>>();

	const imageSize =
		(windowWidth - RELATED_PADDING - RELATED_GAP - RELATED_SLIVER) / 2;

	return (
		<View>
			<Typography size='small' variant='label' weight='medium'>
				Related products
			</Typography>

			<Spacer y={8} />

			<ScrollView
				style={{ marginHorizontal: -16 }}
				contentContainerStyle={[styles.relatedScroll, { gap: RELATED_GAP }]}
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
							height={imageSize}
							width={imageSize}
						/>

						<Spacer y={4} />

						<Typography weight='medium'>{product.name}</Typography>

						<Spacer y={2} />

						<Typography variant='secondary'>
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

const ShareHeader: React.FC = () => {
	const navigation = useNavigation();
	const { product } = useProductContext();

	React.useLayoutEffect(() => {
		const handleShare = () => {
			const productUrl = getFrontendUrl(`/product/${product.id}`);
			Share.share({
				message: `Check out ${product.name} on Habiti: ${productUrl}`,
				url: productUrl
			});
		};

		navigation.setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleShare}>
					<Icon name='share' size={24} />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Share',
					icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
					onPress: handleShare
				}
			]
		});
	}, [navigation, product.id, product.name]);

	return null;
};

const Product = () => {
	const headerHeight = useHeaderHeight();

	return (
		<ProductProvider>
			<ShareHeader />

			<ScrollableScreen
				style={{ paddingTop: headerHeight }}
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
		height: width
	},
	carouselSingle: {
		height: width,
		width: '100%',
		borderRadius: CAROUSEL_RADIUS,
		overflow: 'hidden'
	},
	carouselSingleImage: {
		width: '100%',
		height: '100%'
	},
	relatedScroll: {
		paddingHorizontal: 16
	},
	addToCartContainer: {
		flexDirection: 'row',
		gap: 16,
		padding: 16,
		paddingBottom: 8,
		borderTopWidth: StyleSheet.hairlineWidth,
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
