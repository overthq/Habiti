'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';
import { useProductQuery, useRelatedProductsQuery } from '@/data/queries';
import {
	useAddToCartMutation,
	useUpdateCartProductQuantityMutation
} from '@/data/mutations';
import { GetProductResponse, Product as ProductType } from '@/data/types';
import { cn } from '@/lib/utils';
import {
	RecentlyViewedProduct,
	useRecentlyViewedStore
} from '@/state/recently-viewed-store';
import { useGuestCartStore } from '@/state/guest-cart-store';
import { useAuthStore } from '@/state/auth-store';
import Product from '@/components/store/Product';
import QuantityControl from '@/components/QuantityControl';

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const { data } = useProductQuery(id);

	if (!data) return null;

	return (
		<ProductContextProvider
			product={data.product}
			viewerContext={data.viewerContext}
		>
			<div className='max-w-4xl mx-auto space-y-16'>
				<div className='flex md:gap-12 md:flex-row flex-col gap-4'>
					<ProductImages />
					<ProductMeta />
				</div>

				<RelatedProducts productId={id} />
			</div>
		</ProductContextProvider>
	);
};

const ProductImages = () => {
	const [activeImage, setActiveImage] = React.useState(0);
	const { product } = useProductContext();

	return (
		<div className='grow max-w-lg'>
			<div className='aspect-square rounded-xl overflow-hidden bg-muted'>
				{product.images.length > 0 && (
					<img
						key={product.id}
						src={product.images[activeImage].path}
						alt={product.name}
						className='size-full object-cover'
					/>
				)}
			</div>
			<ImageSelector onSelectImage={setActiveImage} activeIndex={activeImage} />
		</div>
	);
};

interface ImageSelectorProps {
	onSelectImage(index: number): void;
	activeIndex: number;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
	onSelectImage,
	activeIndex
}) => {
	const { product } = useProductContext();

	if (product.images.length === 0) {
		return null;
	}

	return (
		<div className='flex mt-4 gap-3'>
			{product.images.map((image, index) => (
				<button
					key={image.id}
					className={cn(
						`relative size-12 aspect-square transition-all rounded-md overflow-hidden cursor-pointer`,
						index === activeIndex
							? 'ring-2 ring-foreground'
							: 'opacity-50 hover:opacity-100'
					)}
					onClick={() => onSelectImage(index)}
				>
					<Image
						fill
						src={image.path}
						alt={image.path}
						className='object-cover size-full'
					/>
				</button>
			))}
		</div>
	);
};

const ProductMeta = () => {
	const { product, quantity, setQuantity } = useProductContext();

	return (
		<div className='md:max-w-xs w-full'>
			<StorePreview />

			<h2 className='text-2xl font-medium mb-1'>{product.name}</h2>
			<p className='text-2xl font-medium text-muted-foreground mb-2'>
				{formatNaira(product.unitPrice)}
			</p>

			<QuantityControl quantity={quantity} setQuantity={setQuantity} />

			<ProductButtons />

			<div className='mt-4'>
				<p className='font-medium'>Description</p>
				<p className='text-muted-foreground mb-4'>{product.description}</p>
			</div>
		</div>
	);
};

const StorePreview = () => {
	const { product } = useProductContext();

	return (
		<div className='mb-4 flex gap-2 items-center'>
			<Link href={`/store/${product.store.id}`}>
				<div className='size-10 rounded-full bg-muted flex justify-center items-center overflow-hidden'>
					{product.store.image?.path ? (
						<img className='size-full' src={product.store.image.path} />
					) : (
						<p className='text-muted-foreground text-medium'>
							{product.store.name[0]}
						</p>
					)}
				</div>
			</Link>
			<div className='justify-between items-center'>
				<Link href={`/store/${product.store.id}`}>
					<p className='font-medium'>{product.store.name}</p>
				</Link>
			</div>
		</div>
	);
};

const ProductButtons = () => {
	const { cartCommitDisabled, onCartCommit, cartCommitText } =
		useProductContext();

	return (
		<div className='space-y-3'>
			<Button
				disabled={cartCommitDisabled}
				onClick={() => onCartCommit()}
				className='w-full h-10 text-base'
			>
				{cartCommitText}
			</Button>
			<Button
				disabled={cartCommitDisabled}
				onClick={() => onCartCommit(true)}
				className='w-full h-10 text-base'
				variant='secondary'
			>
				Buy now
			</Button>
		</div>
	);
};

interface ProductContextType {
	product: ProductType;
	cartCommitFetching: boolean;
	onCartCommit: (buyNow?: boolean) => void;
	cartCommitDisabled: boolean;
	cartCommitText: string;
	inCart: boolean;
	initialQuantity: number;
	quantity: number;
	setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const ProductContext = React.createContext<ProductContextType | null>(null);

interface ProductContextProviderProps
	extends React.PropsWithChildren,
		GetProductResponse {}

const getRecentProductPayload = (
	product: ProductType
): Omit<RecentlyViewedProduct, 'viewedAt'> => ({
	id: product.id,
	name: product.name,
	storeId: product.storeId,
	storeName: product.store.name,
	unitPrice: product.unitPrice,
	image: product.images[0]?.path ?? null
});

const ProductContextProvider: React.FC<ProductContextProviderProps> = ({
	children,
	product,
	viewerContext
}) => {
	const addToCartMutation = useAddToCartMutation();
	const updateCartProductQuantityMutation =
		useUpdateCartProductQuantityMutation();
	const router = useRouter();
	const addRecentlyViewedProduct = useRecentlyViewedStore(
		state => state.addProduct
	);
	const { accessToken } = useAuthStore();
	const { cartIds: guestCartIds, addCartId: addGuestCartId } =
		useGuestCartStore();
	const isAuthenticated = Boolean(accessToken);

	const cartProduct = viewerContext?.cartProduct;
	const cartId = cartProduct?.cartId;
	const initialQuantity = cartProduct?.quantity ?? 1;
	const [quantity, setQuantity] = React.useState(initialQuantity);

	const cartCommitFetching =
		addToCartMutation.isPending || updateCartProductQuantityMutation.isPending;

	const quantityChanged = initialQuantity !== quantity;

	const cartCommitText = !cartProduct
		? 'Add to cart'
		: quantityChanged
			? 'Update cart'
			: 'In cart';

	const cartCommitDisabled =
		(!!cartProduct && !quantityChanged) || cartCommitFetching;

	const onCartCommit = React.useCallback(
		async (buyNow = false) => {
			try {
				if (!cartProduct) {
					// Find existing guest cart for this store (if any)
					// Guest carts are tracked by their IDs in localStorage
					const { cartProduct: newCartProduct } =
						await addToCartMutation.mutateAsync({
							storeId: product.storeId,
							productId: product.id,
							quantity
						});

					// If user is not authenticated, save the cart ID as a guest cart
					if (!isAuthenticated) {
						addGuestCartId(newCartProduct.cartId);
					}

					if (buyNow) {
						router.push(`/carts/${newCartProduct.cartId}`);
					}
				} else {
					await updateCartProductQuantityMutation.mutateAsync({
						cartId: cartProduct.cartId,
						productId: product.id,
						quantity
					});

					if (buyNow) {
						router.push(`/carts/${cartId}`);
					}
				}
			} catch (error) {
				console.log(error);
			}
		},
		[
			product.storeId,
			product.id,
			quantity,
			cartProduct,
			cartId,
			isAuthenticated,
			addGuestCartId
		]
	);

	// FIXME: Maybe put this in the query instead?
	React.useEffect(() => {
		addRecentlyViewedProduct(getRecentProductPayload(product));
	}, [addRecentlyViewedProduct, product]);

	return (
		<ProductContext.Provider
			value={{
				product,
				cartCommitFetching,
				onCartCommit,
				cartCommitDisabled,
				cartCommitText,
				inCart: !!cartProduct,
				initialQuantity,
				quantity,
				setQuantity
			}}
		>
			{children}
		</ProductContext.Provider>
	);
};

interface RelatedProductsProps {
	productId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
	const { isFetching, data } = useRelatedProductsQuery(productId);

	if (isFetching) {
		return <div />; // Or skeleton
	}

	if (!data || data.products.length === 0) {
		return null;
	}

	return (
		<div>
			<h2 className='text-lg font-medium mb-4 leading-none'>
				Related products
			</h2>

			<div className='flex gap-4 -mx-4 px-4 overflow-x-auto'>
				{data.products.map(product => (
					<Product
						key={product.id}
						id={product.id}
						name={product.name}
						unitPrice={product.unitPrice}
						imagePath={product.images[0]?.path}
					/>
				))}
			</div>
		</div>
	);
};

const useProductContext = () => {
	const context = React.useContext(ProductContext);

	if (!context) {
		throw new Error(
			'useProductContext must be used within ProductContextProvider'
		);
	}

	return context;
};

export const runtime = 'edge';

export default ProductPage;
