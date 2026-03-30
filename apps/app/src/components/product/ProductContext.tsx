import React from 'react';
import { useProductQuery, useRelatedProductsQuery } from '../../data/queries';
import {
	useAddToCartMutation,
	useUpdateCartProductMutation
} from '../../data/mutations';
import type { Product, ProductViewerContext } from '../../data/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { View } from 'react-native';

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

const ProductProviderInner: React.FC<ProductProviderProps> = ({
	children,
	product,
	relatedProducts,
	viewerContext
}) => {
	const { goBack } = useNavigation();

	const addToCart = useAddToCartMutation();
	const updateCartProduct = useUpdateCartProductMutation();

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

	const quantityChanged = React.useMemo(
		() => initialQuantity !== quantity,
		[initialQuantity, quantity]
	);

	const cartCommitText = React.useMemo(
		() =>
			!inCart ? 'Add to cart' : quantityChanged ? 'Update cart' : 'In cart',
		[inCart, quantityChanged]
	);

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
		goBack
	]);

	if (!product) return <View />;

	return (
		<ProductContext.Provider
			value={{
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
			}}
		>
			{children}
		</ProductContext.Provider>
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

	if (isLoading || !product) {
		return <View />;
	}

	return (
		<ProductProviderInner
			product={product}
			relatedProducts={relatedProducts}
			viewerContext={data?.viewerContext}
		>
			{children}
		</ProductProviderInner>
	);
};

export const useProductContext = () => {
	const context = React.useContext(ProductContext);

	if (!context) {
		throw new Error('useProductContext must be used within a ProductProvider');
	}

	return context;
};
