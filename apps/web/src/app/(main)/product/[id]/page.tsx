'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';
import { useProductQuery } from '@/data/queries';
import {
	useAddToCartMutation,
	useUpdateCartProductQuantityMutation
} from '@/data/mutations';
import { GetProductResponse, Product } from '@/data/types';
import { cn } from '@/lib/utils';

const ProductPage = () => {
	const { id } = useParams<{ id: string }>();
	const { data } = useProductQuery(id);

	if (!data) return null;

	return (
		<ProductContextProvider
			product={data.product}
			viewerContext={data.viewerContext}
		>
			<div className='max-w-4xl mx-auto'>
				<div className='flex gap-12 sm:flex-row flex-col'>
					<ProductImages />
					<ProductMeta />
				</div>
			</div>
		</ProductContextProvider>
	);
};

const ProductImages = () => {
	const [activeImage, setActiveImage] = React.useState(0);
	const { product } = useProductContext();

	return (
		<div className='flex-1'>
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
	const { product } = useProductContext();

	return (
		<div className='md:max-w-xs w-full'>
			<StorePreview />

			<h2 className='text-2xl font-medium mb-1'>{product.name}</h2>
			<p className='text-2xl font-medium text-muted-foreground mb-2'>
				{formatNaira(product.unitPrice)}
			</p>

			<QuantityControl />

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
		<div className='mb-4 w-min'>
			<Link
				href={`/store/${product.store.id}`}
				className='flex gap-2 items-center'
			>
				<div className='size-10 rounded-full bg-muted flex justify-center items-center overflow-hidden'>
					{product.store.image?.path ? (
						<img className='size-full' src={product.store.image.path} />
					) : (
						<p className='text-muted-foreground text-medium'>
							{product.store.name[0]}
						</p>
					)}
				</div>
				<div className='justify-between items-center'>
					<p className='font-medium'>{product.store.name}</p>
				</div>
			</Link>
		</div>
	);
};

const QuantityControl = () => {
	const { quantity, setQuantity } = useProductContext();

	const decrementDisabled = React.useMemo(() => quantity === 1, [quantity]);

	const increment = React.useCallback(() => setQuantity(q => q + 1), []);
	const decrement = React.useCallback(() => setQuantity(q => q - 1), []);

	return (
		<div className='mb-4 space-y-2'>
			<p className='font-medium'>Quantity</p>

			<div className='flex items-center gap-6 border rounded-md w-min py-2 px-3'>
				<button
					onClick={decrement}
					disabled={decrementDisabled}
					className='bg-transparent'
				>
					<Minus className='size-4' />
				</button>
				<p className='text-sm tabular-nums'>{quantity}</p>
				<button onClick={increment} className='bg-transparent'>
					<Plus className='size-4' />
				</button>
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
	product: Product;
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

const ProductContextProvider: React.FC<ProductContextProviderProps> = ({
	children,
	product,
	viewerContext
}) => {
	const addToCartMutation = useAddToCartMutation();
	const updateCartProductQuantityMutation =
		useUpdateCartProductQuantityMutation();
	const router = useRouter();

	const { cartProduct } = viewerContext;

	const cartId = cartProduct?.cartId;
	const initialQuantity = cartProduct?.quantity;
	const [quantity, setQuantity] = React.useState(initialQuantity ?? 1);

	const inCart = React.useMemo(() => !!cartProduct, [cartProduct]);

	const isNotInCart = !cartId || (cartId && !inCart);

	const cartCommitFetching =
		addToCartMutation.isPending || updateCartProductQuantityMutation.isPending;

	const quantityChanged = initialQuantity !== quantity;

	const cartCommitText = isNotInCart
		? 'Add to cart'
		: quantityChanged
			? 'Update cart'
			: 'In cart';

	const cartCommitDisabled = (inCart && !quantityChanged) || cartCommitFetching;

	const onCartCommit = React.useCallback(
		async (buyNow = false) => {
			try {
				if (isNotInCart) {
					const { cart } = await addToCartMutation.mutateAsync({
						storeId: product.storeId,
						productId: product.id,
						quantity
					});

					if (buyNow) {
						router.push(`/carts/${cart.id}`);
					}
				} else {
					await updateCartProductQuantityMutation.mutateAsync({
						cartId,
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
		[product.storeId, product.id, quantity, isNotInCart, cartId]
	);

	return (
		<ProductContext.Provider
			value={{
				product,
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
