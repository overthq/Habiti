import React from 'react';
import {
	ProductQuery,
	useAddToCartMutation,
	useProductQuery,
	useUpdateCartProductMutation
} from '../../types/api';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { View } from 'react-native';

interface ProductContextType {
	product: ProductQuery['product'];
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
	product: ProductQuery['product'];
}

// FIXME: I'm aware that this is in need of a major refactor,
// but putting everything in this context makes the actual refactor easier
// (The refactor may include server-side changes as well, so updating the
// client-side adapters is easier this way).

const ProductProviderInner: React.FC<ProductProviderProps> = ({
	children,
	product
}) => {
	const { goBack } = useNavigation();

	const [{ fetching: addFetching }, addToCart] = useAddToCartMutation();
	const [{ fetching: updateFetching }, updateCartProduct] =
		useUpdateCartProductMutation();

	const cartId = React.useMemo(
		() => product.store.userCart?.id,
		[product.store.userCart?.id]
	);

	const initialQuantity = React.useMemo(
		() =>
			product.store.userCart?.products.find(p => p.productId === product.id)
				?.quantity,
		[product.store.userCart?.products, product.id]
	);

	const [quantity, setQuantity] = React.useState(initialQuantity ?? 1);

	const isNotInCart = React.useMemo(
		() => !cartId || (cartId && !product.inCart),
		[cartId, product.inCart]
	);

	const cartCommitFetching = React.useMemo(
		() => addFetching || updateFetching,
		[addFetching, updateFetching]
	);

	const quantityChanged = React.useMemo(
		() => initialQuantity !== quantity,
		[initialQuantity, quantity]
	);

	const cartCommitText = React.useMemo(
		() =>
			isNotInCart ? 'Add to cart' : quantityChanged ? 'Update cart' : 'In cart',
		[isNotInCart, quantityChanged]
	);

	const cartCommitDisabled = React.useMemo(
		() => (product.inCart && !quantityChanged) || cartCommitFetching,
		[product.inCart, quantityChanged, cartCommitFetching]
	);

	const onCartCommit = React.useCallback(async () => {
		if (isNotInCart) {
			await addToCart({
				input: { storeId: product.storeId, productId: product.id, quantity }
			});
		} else {
			await updateCartProduct({
				input: { cartId, productId: product.id, quantity }
			});
		}

		goBack();
	}, [product.storeId, product.id, quantity, isNotInCart, cartId, goBack]);

	if (!product) return <View />;

	return (
		<ProductContext.Provider
			value={{
				product,
				cartCommitFetching,
				onCartCommit,
				cartCommitDisabled,
				cartCommitText,
				inCart: product.inCart,
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
	const [{ data, fetching }] = useProductQuery({
		variables: { productId: params.productId }
	});

	const product = data?.product;

	if (fetching || !product) {
		return <View />;
	}

	return (
		<ProductProviderInner product={product}>{children}</ProductProviderInner>
	);
};

export const useProductContext = () => {
	const context = React.useContext(ProductContext);

	if (!context) {
		throw new Error('useProductContext must be used within a ProductProvider');
	}

	return context;
};
