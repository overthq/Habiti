import React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { formatNaira } from '@habiti/common';
import {
	CustomImage,
	Icon,
	IconButton,
	Row,
	Screen,
	ScreenHeader,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import FAB from '../components/FAB';
import { useProductsQuery } from '../data/queries';
import { useProductsFilterStore, ProductsFilters } from '../state/filters';
import { useSheet } from '../navigation/useSheet';
import { Product, ProductFilters } from '../data/types';
import type {
	ProductsStackParamList,
	ProductsStackScreenProps
} from '../navigation/types';

const Products = ({ navigation }: ProductsStackScreenProps<'ProductsList'>) => {
	const { top } = useSafeAreaInsets();

	const handleOpenAddProduct = () => {
		navigation.navigate('Modal.AddProduct');
	};

	return (
		<ProductsProvider>
			<Screen style={{ padding: 0, paddingTop: top }}>
				<ProductsScreenHeader />
				<Animated.View style={{ flex: 1 }} layout={LinearTransition}>
					<ProductList />
				</Animated.View>
				<FAB onPress={handleOpenAddProduct} text='New Product' />
			</Screen>
		</ProductsProvider>
	);
};

interface ProductsContextType {
	products: Product[];
	isLoading: boolean;
	refreshing: boolean;
	refresh: () => void;
	openFilterModal: () => void;
	clearFilters: () => void;
	search: string;
	setSearch: (value: string) => void;
}

const ProductsContext = React.createContext<ProductsContextType | null>(null);

const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const { openSheet } = useSheet();
	const filters = useProductsFilterStore(state => state.filters);
	const clearFilters = useProductsFilterStore(state => state.clearFilters);
	const [search, setSearch] = React.useState('');

	const queryFilters = buildFiltersFromState({ ...filters, search });
	const { data, isLoading, isRefetching, refetch } =
		useProductsQuery(queryFilters);

	const refresh = React.useCallback(() => {
		refetch();
	}, [refetch]);

	const openFilterModal = React.useCallback(() => {
		openSheet('productsFilter');
	}, [openSheet]);

	const value = React.useMemo<ProductsContextType>(
		() => ({
			products: data?.products ?? [],
			isLoading,
			refreshing: isRefetching,
			refresh,
			openFilterModal,
			clearFilters,
			search,
			setSearch
		}),
		[
			data,
			isLoading,
			isRefetching,
			refresh,
			openFilterModal,
			clearFilters,
			search
		]
	);

	return (
		<ProductsContext.Provider value={value}>
			{children}
		</ProductsContext.Provider>
	);
};

const buildFiltersFromState = (filters: ProductsFilters): ProductFilters => {
	const result: ProductFilters = {};

	if (filters.categoryId) {
		result.categoryId = filters.categoryId;
	}

	if (filters.sortBy) {
		result.orderBy = sortByMap[filters.sortBy];
	}

	if (filters.search) {
		result.search = filters.search;
	}

	return result;
};

const sortByMap: Record<
	NonNullable<ProductsFilters['sortBy']>,
	ProductFilters['orderBy']
> = {
	'created-at-desc': { createdAt: 'desc' },
	'unit-price-desc': { unitPrice: 'desc' },
	'unit-price-asc': { unitPrice: 'asc' }
};

const useProductsContext = () => {
	const context = React.use(ProductsContext);

	if (!context) {
		throw new Error(
			'useProductsContext must be used within a ProductsProvider'
		);
	}

	return context;
};

const ProductsScreenHeader = () => {
	const { openFilterModal, search, setSearch } = useProductsContext();

	return (
		<ScreenHeader
			title='Products'
			search={{
				placeholder: 'Search products',
				value: search,
				onChangeText: setSearch
			}}
			right={
				<IconButton
					name='sliders-horizontal'
					size={20}
					onPress={openFilterModal}
					style={{ marginVertical: -10, marginRight: -12 }}
				/>
			}
			hasBottomBorder
		/>
	);
};

const ProductList: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const { theme } = useTheme();
	const { products, search, refreshing, refresh } = useProductsContext();
	const [editMode, setEditMode] = React.useState(false);
	const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

	const handlePress = React.useCallback(
		(productId: string) => () =>
			navigate('Product', { screen: 'Product.Main', params: { productId } }),
		[navigate]
	);

	const handleLongPress = React.useCallback(
		(productId: string) => () => {
			setEditMode(true);
			setSelectedProducts(prev =>
				prev.includes(productId) ? prev : [...prev, productId]
			);
		},
		[]
	);

	const clearSelectedProducts = React.useCallback(() => {
		setEditMode(false);
		setSelectedProducts([]);
	}, []);

	const renderProduct: ListRenderItem<Product> = React.useCallback(
		({ item }) => {
			return (
				<ProductsListItem
					product={item}
					onPress={handlePress(item.id)}
					onLongPress={handleLongPress(item.id)}
				/>
			);
		},
		[handlePress, handleLongPress]
	);

	const refreshControl = React.useMemo(
		() => (
			<RefreshControl
				refreshing={refreshing}
				onRefresh={refresh}
				tintColor={theme.text.secondary}
			/>
		),
		[refreshing, refresh, theme.text.secondary]
	);

	return (
		<View style={{ flex: 1 }}>
			<FlashList
				keyExtractor={i => i.id}
				data={products}
				renderItem={renderProduct}
				style={{ marginHorizontal: -16 }}
				contentContainerStyle={{
					flexGrow: 1,
					backgroundColor: theme.screen.background
				}}
				ListEmptyComponent={
					<View style={listStyles.empty}>
						<Typography variant='secondary' style={listStyles.emptyText}>
							{search
								? 'No products match your search.'
								: "You don't have any products yet."}
						</Typography>
					</View>
				}
				refreshControl={refreshControl}
			/>
		</View>
	);
};

const listStyles = StyleSheet.create({
	empty: {
		paddingTop: 32,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 16
	},
	emptyText: {
		textAlign: 'center'
	}
});

interface ProductsListItemProps {
	product: Product;
	onPress(): void;
	onLongPress?(): void;
}

const ProductsListItem: React.FC<ProductsListItemProps> = ({
	product,
	onPress,
	onLongPress
}) => {
	const { theme } = useTheme();

	return (
		<Row
			onPress={onPress}
			onLongPress={onLongPress}
			style={itemStyles.container}
		>
			<View style={itemStyles.left}>
				<CustomImage
					uri={product.images[0]?.path.replace('http://', 'https://')}
					style={itemStyles.image}
					height={44}
					width={44}
				/>
				<View>
					<Typography style={itemStyles.name}>{product.name}</Typography>
					<Typography variant='secondary'>
						{formatNaira(product.unitPrice)}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' color={theme.text.secondary} />
		</Row>
	);
};

const itemStyles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 12
	},
	name: {
		marginBottom: 2
	},
	left: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	image: {
		marginRight: 8
	}
});

export default Products;
