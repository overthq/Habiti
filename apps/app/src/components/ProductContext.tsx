import React from 'react';
import { useProductQuery, useRelatedProductsQuery } from '../data/queries';
import {
	useAddToCartMutation,
	useUpdateCartProductMutation
} from '../data/mutations';
import type { Product, ProductViewerContext } from '../data/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/types';
import { View } from 'react-native';
import {
	RecentlyViewedProduct,
	useRecentlyViewedStore
} from '../state/recentlyViewed';

interface ProductContextType {
	product: Product;
	relatedProducts: Product[];
	cartCommitFetching: boolean;
	onCartCommit: () => void;
	cartCommitDisabled: boolean;
	cartCommitText: string;
	inCart: boolean;
	initialQuantity: number;
	quantity: number;
	setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const ProductContext = React.createContext<ProductContextType | null>(null);

interface ProductProviderProps {
	children: React.ReactNode;
	product: Product;
	relatedProducts: Product[];
	viewerContext?: ProductViewerContext;
}

// FIXME: I'm aware that this is in need of a major refactor,
// but putting everything in this context makes the actual refactor easier
// (The refactor may include server-side changes as well, so updating the
// client-side adapters is easier this way).

const getRecentProductPayload = (
	product: Product
): Omit<RecentlyViewedProduct, 'viewedAt'> => ({
	id: product.id,
	name: product.name,
	storeId: product.storeId,
	storeName: product.store.name,
	unitPrice: product.unitPrice,
	image: product.images[0]?.path ?? null
});

const ProductProviderInner: React.FC<ProductProviderProps> = ({
	children,
	product,
	relatedProducts,
	viewerContext
}) => {
	const { goBack } = useNavigation();

	const addToCart = useAddToCartMutation();
	const updateCartProduct = useUpdateCartProductMutation();
	const addRecentlyViewedProduct = useRecentlyViewedStore(
		state => state.addProduct
	);

	React.useEffect(() => {
		addRecentlyViewedProduct(getRecentProductPayload(product));
	}, [addRecentlyViewedProduct, product]);

	const cartProduct = viewerContext?.cartProduct;
	const inCart = !!cartProduct;

	const initialQuantity = React.useMemo(
		() => cartProduct?.quantity,
		[cartProduct?.quantity]
	);

	const [quantity, setQuantity] = React.useState(initialQuantity ?? 1);

	const cartCommitFetching = React.useMemo(
		() => addToCart.isPending || updateCartProduct.isPending,
		[addToCart.isPending, updateCartProduct.isPending]
	);

	const quantityChanged = initialQuantity !== quantity;

	const cartCommitText = !inCart
		? 'Add to cart'
		: quantityChanged
			? 'Update cart'
			: 'In cart';

	const cartCommitDisabled = React.useMemo(
		() => (inCart && !quantityChanged) || cartCommitFetching,
		[inCart, quantityChanged, cartCommitFetching]
	);

	const onCartCommit = React.useCallback(async () => {
		if (!inCart) {
			await addToCart.mutateAsync({
				storeId: product.storeId,
				productId: product.id,
				quantity
			});
		} else {
			await updateCartProduct.mutateAsync({
				productId: product.id,
				body: { cartId: cartProduct.cartId, quantity }
			});
		}

		goBack();
	}, [
		product.storeId,
		product.id,
		quantity,
		inCart,
		cartProduct?.cartId,
		goBack,
		addToCart,
		updateCartProduct
	]);

	const value = React.useMemo(
		() => ({
			product,
			relatedProducts,
			cartCommitFetching,
			onCartCommit,
			cartCommitDisabled,
			cartCommitText,
			inCart,
			initialQuantity: initialQuantity ?? 1,
			quantity,
			setQuantity
		}),
		[
			product,
			relatedProducts,
			cartCommitFetching,
			onCartCommit,
			cartCommitDisabled,
			cartCommitText,
			inCart,
			initialQuantity,
			quantity,
			setQuantity
		]
	);

	if (!product) return <View />;

	return (
		<ProductContext.Provider value={value}>{children}</ProductContext.Provider>
	);
};

export const ProductProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'Product'>>();
	const { data, isLoading } = useProductQuery(params.productId);
	const { data: relatedProductsData, isLoading: isRelatedProductsLoading } =
		useRelatedProductsQuery(params.productId);

	const product = data?.product;
	const relatedProducts = relatedProductsData?.products;

	if (isLoading || isRelatedProductsLoading || !product) {
		return <View />;
	}

	return (
		<ProductProviderInner
			product={product}
			relatedProducts={relatedProducts ?? []}
			viewerContext={data?.viewerContext}
		>
			{children}
		</ProductProviderInner>
	);
};

export const useProductContext = () => {
	const context = React.use(ProductContext);

	if (!context) {
		throw new Error('useProductContext must be used within a ProductProvider');
	}

	return context;
};
