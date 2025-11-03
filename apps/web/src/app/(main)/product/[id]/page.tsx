'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { formatNaira } from '@/utils/currency';
import { useProductQuery } from '@/data/queries';
import {
	useAddToCartMutation,
	useUpdateCartProductQuantityMutation
} from '@/data/mutations';
import { GetProductResponse, Product } from '@/data/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';

interface ProductContextType {
	product: Product;
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

	const { cartProduct } = viewerContext;

	const cartId = cartProduct?.cartId;
	const initialQuantity = cartProduct?.quantity;
	const [quantity, setQuantity] = React.useState(initialQuantity ?? 1);

	const inCart = React.useMemo(() => {
		return !!cartProduct;
	}, [cartProduct]);

	const isNotInCart = React.useMemo(
		() => !cartId || (cartId && !inCart),
		[cartId, inCart]
	);

	const cartCommitFetching = React.useMemo(
		() =>
			addToCartMutation.isPending ||
			updateCartProductQuantityMutation.isPending,
		[addToCartMutation.isPending, updateCartProductQuantityMutation.isPending]
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
		() => (inCart && !quantityChanged) || cartCommitFetching,
		[inCart, quantityChanged, cartCommitFetching]
	);

	const onCartCommit = React.useCallback(async () => {
		if (isNotInCart) {
			addToCartMutation.mutate({
				storeId: product.storeId,
				productId: product.id,
				quantity
			});
		} else {
			updateCartProductQuantityMutation.mutate({
				cartId,
				productId: product.id,
				quantity
			});
		}
	}, [product.storeId, product.id, quantity, isNotInCart, cartId]);

	if (!product) return null;

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

const ProductWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { id } = useParams<{ id: string }>();
	const { data } = useProductQuery(id);

	if (!data) return null;

	return <ProductContextProvider {...data}>{children}</ProductContextProvider>;
};

const StorePreview = () => {
	const { product } = useProductContext();

	return (
		<Link href={`/store/${product.store.id}`}>
			<div className='mb-6 rounded-md flex gap-2 items-center'>
				<div className='size-12 rounded-full bg-muted overflow-hidden'>
					{product.store.image?.path && (
						<img className='size-full' src={product.store.image?.path} />
					)}
				</div>
				<div className='justify-between items-center'>
					<p className='font-medium'>{product.store.name}</p>
					<p className='text-xs text-muted-foreground'>Visit store</p>
				</div>
			</div>
		</Link>
	);
};

const ProductDetails = () => {
	const { product } = useProductContext();

	return (
		<div>
			<h1 className='text-xl font-medium mb-1'>{product.name}</h1>
			<p className='text-lg mb-2'>{formatNaira(product.unitPrice)}</p>
			<p className='text-muted-foreground mb-4'>{product.description}</p>
		</div>
	);
};

const QuantityControl = () => {
	const { quantity, setQuantity } = useProductContext();

	const decrementDisabled = React.useMemo(() => quantity === 1, [quantity]);

	const increment = React.useCallback(() => setQuantity(q => q + 1), []);
	const decrement = React.useCallback(() => setQuantity(q => q - 1), []);

	return (
		<div className='flex justify-between items-center mb-4'>
			<p className='font-medium'>Quantity</p>
			<div className='flex items-center gap-4 border rounded-md'>
				<Button
					variant='ghost'
					size='sm'
					onClick={decrement}
					disabled={decrementDisabled}
				>
					<Minus className='size-4' />
				</Button>
				<p className='text-sm tabular-nums'>{quantity}</p>
				<Button variant='ghost' size='sm' onClick={increment}>
					<Plus className='size-4' />
				</Button>
			</div>
		</div>
	);
};

const ProductButtons = () => {
	const { cartCommitDisabled, onCartCommit, cartCommitText } =
		useProductContext();

	return (
		<div className='space-y-2'>
			<Button
				disabled={cartCommitDisabled}
				onClick={onCartCommit}
				className='w-full'
			>
				{cartCommitText}
			</Button>
			<Button
				disabled={cartCommitDisabled}
				onClick={onCartCommit}
				className='w-full'
				variant='secondary'
			>
				Buy now
			</Button>
		</div>
	);
};

const ProductPage = () => {
	return (
		<ProductWrapper>
			<div className='mx-auto max-w-4xl'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					<ProductImages />
					<div className='md:col-span-1'>
						<StorePreview />
						<ProductDetails />
						<QuantityControl />
						<ProductButtons />
					</div>
				</div>
			</div>
		</ProductWrapper>
	);
};

const ProductImages = () => {
	const [activeImage, setActiveImage] = React.useState(0);
	const { product } = useProductContext();

	return (
		<div className='md:col-span-2'>
			<div className='relative aspect-square rounded-md overflow-hidden bg-muted'>
				{product.images.length > 0 && (
					<Image
						key={product.id}
						src={product.images[activeImage].path}
						alt={product.name}
						fill
						className='w-full max-w-170 h-auto object-cover rounded-lg'
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
						`relative size-14 aspect-square transition-all rounded-md overflow-hidden cursor-pointer`,
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

export const runtime = 'edge';

export default ProductPage;
