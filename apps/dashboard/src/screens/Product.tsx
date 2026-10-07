import React from 'react';
import { Alert, View, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';
import {
	Icon,
	Spacer,
	ScrollableScreen,
	PillButton,
	TextButton,
	Typography,
	useTheme
} from '@habiti/components';
import { formatNaira } from '@habiti/common';

import { useProductQuery } from '../data/queries';
import { useDeleteProductMutation } from '../data/mutations';
import useRefresh from '../hooks/useRefresh';
import Refresher from '../components/Refresher';
import { useSheet } from '../navigation/useSheet';
import { shareProduct, viewProductInBrowser } from '../utils/share';

import {
	AppStackParamList,
	ProductStackScreenProps
} from '../navigation/types';
import {
	Image as ImageType,
	ProductCategory,
	Product as ProductType
} from '../data/types';

const Product: React.FC<ProductStackScreenProps<'Product.Main'>> = ({
	navigation,
	route
}) => {
	const { productId } = route.params;

	const { data, refetch, isRefetching } = useProductQuery(productId);
	const { isRefreshing, onRefresh } = useRefresh({ refetch, isRefetching });

	React.useLayoutEffect(() => {
		if (data?.product?.name) {
			navigation.setOptions({ headerTitle: data.product.name });
		}
	}, [navigation, data?.product?.name]);

	if (!data?.product) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<Refresher refreshing={isRefreshing} onRefresh={onRefresh} />
			}
			showsVerticalScrollIndicator={true}
		>
			<Spacer y={16} />

			<ProductDetails product={data.product} />

			<Spacer y={16} />

			<EditButtons product={data.product} />

			<Spacer y={16} />

			<ProductMedia images={data.product.images} productId={productId} />

			<Spacer y={16} />

			<ProductCategories
				categories={data.product.categories}
				productId={productId}
			/>

			<ProductMenu product={data.product} productId={productId} />
		</ScrollableScreen>
	);
};

interface ProductDetailsProps {
	product: ProductType;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
	return (
		<View>
			<Typography size='xlarge' weight='medium'>
				{product.name}
			</Typography>

			<Spacer y={8} />

			<Typography variant='secondary'>{product.description}</Typography>
		</View>
	);
};

interface EmptyStateProps {
	title: string;
	description: string;
	actionText: string;
	action(): void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
	title,
	description,
	actionText,
	action
}) => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.input.background,
				padding: 32,
				borderRadius: 6,
				alignItems: 'center'
			}}
		>
			<Typography weight='medium' size='large'>
				{title}
			</Typography>

			<Spacer y={4} />

			<Typography variant='secondary'>{description}</Typography>

			<Spacer y={12} />

			<PillButton
				style={{ alignSelf: 'center' }}
				onPress={action}
				text={actionText}
			/>
		</View>
	);
};

interface EditButtonsProps {
	product: ProductType;
}

const EditButtons: React.FC<EditButtonsProps> = ({ product }) => {
	const { openSheet } = useSheet();

	const openPriceModal = () => {
		openSheet('productPrice', {
			productId: product.id,
			initialPrice: product.unitPrice
		});
	};

	const openInventoryModal = () => {
		openSheet('productInventory', {
			productId: product.id,
			initialQuantity: product.quantity
		});
	};

	return (
		<View style={styles.editContainer}>
			<EditRow
				label='Price'
				value={formatNaira(product.unitPrice)}
				onPress={openPriceModal}
			/>
			<EditRow
				label='Inventory'
				value={product.quantity.toString()}
				onPress={openInventoryModal}
			/>
		</View>
	);
};

interface EditRowProps {
	label: string;
	value: string;
	onPress(): void;
}

const EditRow: React.FC<EditRowProps> = ({ label, value, onPress }) => {
	return (
		<View>
			<Typography size='large' weight='medium'>
				{label}
			</Typography>

			<Spacer y={4} />

			<View style={styles.editRow}>
				<Typography size='xlarge'>{value}</Typography>

				<Typography size='large' weight='medium' variant='secondary'>
					·
				</Typography>

				<TextButton
					onPress={onPress}
					size={16}
					weight='medium'
					variant='secondary'
				>
					Update
				</TextButton>
			</View>
		</View>
	);
};

interface ProductMediaProps {
	images: ImageType[];
	productId: string;
}

const ProductMedia: React.FC<ProductMediaProps> = ({ images, productId }) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { theme } = useTheme();

	return (
		<View>
			<View style={styles.header}>
				<Typography weight='medium' size='large'>
					Media
				</Typography>
				<TextButton
					onPress={() =>
						navigate('Modal.EditProductImages', { productId, images })
					}
					size={15}
				>
					Manage
				</TextButton>
			</View>
			<Spacer y={8} />
			{images?.length === 0 ? (
				<EmptyState
					title='No images'
					description='Images will appear here.'
					actionText='Add image'
					action={() =>
						navigate('Modal.EditProductImages', { productId, images })
					}
				/>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.scroll}
					contentContainerStyle={styles.scrollContent}
				>
					{images.map(image => (
						<View
							key={image.id}
							style={[
								styles.imageContainer,
								{ borderColor: theme.border.color }
							]}
						>
							<Image
								source={{ uri: image.path.replace('http://', 'https://') }}
								style={styles.image}
							/>
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
};

interface ProductCategoriesProps {
	categories: ProductCategory[];
	productId: string;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	categories,
	productId
}) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	return (
		<View>
			<View style={styles.header}>
				<Typography size='large' weight='medium'>
					Categories
				</Typography>
				<TextButton
					variant='secondary'
					onPress={() =>
						navigate('Modal.EditProductCategories', { productId, categories })
					}
					size={15}
				>
					Update
				</TextButton>
			</View>
			<Spacer y={8} />
			{categories?.length === 0 ? (
				<EmptyState
					title='No categories'
					description='Categories will appear here.'
					actionText='Add category'
					action={() =>
						navigate('Modal.EditProductCategories', { productId, categories })
					}
				/>
			) : (
				<View style={styles.chips}>
					{categories.map(({ category }) => (
						<View
							key={category.id}
							style={[
								styles.chip,
								{ backgroundColor: theme.button.disabled.background }
							]}
						>
							<Typography variant='primary' weight='medium' size='small'>
								{category.name}
							</Typography>
						</View>
					))}
				</View>
			)}
		</View>
	);
};

interface ProductMenuProps {
	productId: string;
	product: ProductType;
}

const ProductMenu: React.FC<ProductMenuProps> = ({ productId, product }) => {
	const { setOptions, navigate, goBack } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const deleteProductMutation = useDeleteProductMutation();
	const { openSheet } = useSheet();

	const handleDeleteProduct = React.useCallback(() => {
		Alert.alert(
			'Delete product',
			'Are you sure you want to delete this product? This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						deleteProductMutation.mutate(productId, {
							onSuccess: () => goBack()
						});
					}
				}
			]
		);
	}, [productId, deleteProductMutation, goBack]);

	const handleEditProduct = React.useCallback(() => {
		navigate('Modal.EditProductDetails', {
			productId,
			name: product.name,
			description: product.description
		});
	}, [navigate, productId, product]);

	const handleShareProduct = React.useCallback(() => {
		shareProduct(productId, product.name);
	}, [productId, product.name]);

	const handleOpenInBrowser = React.useCallback(() => {
		viewProductInBrowser(productId);
	}, [productId]);

	const handleOpenMenu = React.useCallback(() => {
		openSheet('productMenu', {
			onEditProduct: handleEditProduct,
			onDeleteProduct: handleDeleteProduct,
			onShareProduct: handleShareProduct,
			onViewInBrowser: handleOpenInBrowser
		});
	}, [
		openSheet,
		handleEditProduct,
		handleDeleteProduct,
		handleShareProduct,
		handleOpenInBrowser
	]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleOpenMenu}>
					<Icon name='more-vertical' />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'menu',
					label: 'Options',
					icon: {
						type: 'sfSymbol',
						name: 'ellipsis'
					},
					menu: {
						singleSelection: false,
						items: [
							{
								type: 'action',
								label: 'Edit',
								icon: { type: 'sfSymbol', name: 'pencil' },
								onPress: handleEditProduct
							},
							{
								type: 'action',
								label: 'View in browser',
								icon: { type: 'sfSymbol', name: 'safari' },
								onPress: handleOpenInBrowser
							},
							{
								type: 'action',
								label: 'Share',
								icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
								onPress: handleShareProduct
							},
							{
								type: 'action',
								label: 'Delete product',
								icon: { type: 'sfSymbol', name: 'trash' },
								destructive: true,
								onPress: handleDeleteProduct
							}
						]
					}
				}
			]
		});
	}, [
		setOptions,
		handleOpenMenu,
		handleDeleteProduct,
		handleShareProduct,
		handleOpenInBrowser,
		handleEditProduct
	]);

	return null;
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	editContainer: {
		gap: 16
	},
	editRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	scroll: {
		marginHorizontal: -16
	},
	scrollContent: {
		flexGrow: 1,
		gap: 8,
		paddingHorizontal: 16
	},
	imageContainer: {
		borderWidth: 1,
		borderRadius: 8,
		width: 100,
		height: 100,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	chip: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 100
	},
	chips: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6
	}
});

export default Product;
