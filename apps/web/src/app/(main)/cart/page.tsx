'use client';

import React from 'react';
import Link from 'next/link';
import { useCartsQuery, useGuestCartsQuery } from '@/data/queries';
import { useUpdateCartProductQuantityMutation } from '@/data/mutations';
import { Button } from '@/components/ui/button';
import SignInPrompt from '@/components/SignInPrompt';
import { useAuthStore } from '@/state/auth-store';
import { useGuestCartStore } from '@/state/guest-cart-store';
import { Cart, CartProduct } from '@/data/types';
import { formatNaira } from '@/utils/currency';
import { cn } from '@/lib/utils';
import useDebounce from '@/hooks/use-debounce';
import { formatDate } from '@/utils/date';
import QuantityControl from '@/components/QuantityControl';

interface CartProductItemProps {
	cart: Cart;
	cartProduct: CartProduct;
	localQuantity: number;
	onQuantityChange: (productId: string, quantity: number) => void;
}

const CartProductItem: React.FC<CartProductItemProps> = ({
	cart,
	cartProduct,
	localQuantity,
	onQuantityChange
}) => {
	const isOverQuantity = localQuantity > cartProduct.product.quantity;

	return (
		<div className='flex items-center gap-2.5 p-2 not-last:border-b'>
			<div className='size-13 bg-muted rounded flex items-center justify-center overflow-hidden'>
				{cartProduct.product.images[0] && (
					<img
						src={cartProduct.product.images[0].path}
						alt={cartProduct.product.name}
						className='size-full object-cover'
						loading='lazy'
					/>
				)}
			</div>
			<div className='flex-1 min-w-0'>
				<p className='truncate'>{cartProduct.product.name}</p>
				<p
					className={cn(
						'text-sm text-muted-foreground',
						isOverQuantity && 'text-destructive'
					)}
				>
					{formatNaira(cartProduct.product.unitPrice * localQuantity)}
					{isOverQuantity && (
						<span className='ml-1'>
							(Only {cartProduct.product.quantity} available)
						</span>
					)}
				</p>
			</div>

			<QuantityControl
				quantity={localQuantity}
				setQuantity={quantity =>
					onQuantityChange(cartProduct.productId, quantity)
				}
				allowDelete
			/>
		</div>
	);
};

interface CartItemProps {
	cart: Cart;
}

const CartItem: React.FC<CartItemProps> = ({ cart: initialCart }) => {
	const updateQuantityMutation = useUpdateCartProductQuantityMutation();
	const [localQuantities, setLocalQuantities] = React.useState<
		Record<string, number>
	>(() => {
		const initial: Record<string, number> = {};
		initialCart.products.forEach(p => {
			initial[p.productId] = p.quantity;
		});
		return initial;
	});

	// Sync local quantities when cart data changes (e.g., from refetch)
	React.useEffect(() => {
		const newQuantities: Record<string, number> = {};
		initialCart.products.forEach(p => {
			newQuantities[p.productId] = p.quantity;
		});
		setLocalQuantities(newQuantities);
	}, [initialCart.products]);

	const pendingUpdatesRef = React.useRef<Map<string, number>>(new Map());

	const processBatchedUpdates = React.useCallback(() => {
		const updates = Array.from(pendingUpdatesRef.current.entries());
		if (updates.length === 0) return;

		updates.forEach(([productId, quantity]) => {
			updateQuantityMutation.mutate({
				cartId: initialCart.id,
				productId,
				quantity
			});
		});

		pendingUpdatesRef.current.clear();
	}, [initialCart.id, updateQuantityMutation]);

	const debouncedProcessUpdates = useDebounce(processBatchedUpdates, 1000);

	const handleQuantityChange = React.useCallback(
		(productId: string, quantity: number) => {
			setLocalQuantities(prev => ({
				...prev,
				[productId]: quantity
			}));

			pendingUpdatesRef.current.set(productId, quantity);
			debouncedProcessUpdates();
		},
		[debouncedProcessUpdates]
	);

	// Filter out products with 0 quantity locally
	const visibleProducts = initialCart.products.filter(
		p => (localQuantities[p.productId] ?? p.quantity) > 0
	);

	// Calculate local subtotal
	const localSubtotal = visibleProducts.reduce((acc, product) => {
		const qty = localQuantities[product.productId] ?? product.quantity;
		return acc + product.product.unitPrice * qty;
	}, 0);

	if (visibleProducts.length === 0) {
		return null;
	}

	return (
		<div className='border rounded-lg overflow-hidden'>
			<div className='flex items-center gap-3 p-4 bg-muted/50 border-b'>
				<Link
					href={`/store/${initialCart.storeId}`}
					className='size-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0'
				>
					{initialCart.store.image ? (
						<img
							src={initialCart.store.image.path}
							alt={initialCart.store.name}
							className='size-full object-cover'
						/>
					) : (
						<p className='text-muted-foreground uppercase font-medium'>
							{initialCart.store.name[0]}
						</p>
					)}
				</Link>
				<div className='flex-1 min-w-0'>
					<Link
						href={`/store/${initialCart.storeId}`}
						className='font-medium hover:underline truncate block'
					>
						{initialCart.store.name}
					</Link>
					<p className='text-muted-foreground text-sm'>
						Added {formatDate(initialCart.createdAt)}
					</p>
				</div>
				<Button asChild size='sm'>
					<Link href={`/carts/${initialCart.id}`}>Checkout</Link>
				</Button>
			</div>

			<div>
				{visibleProducts.map(cartProduct => (
					<CartProductItem
						key={`${cartProduct.cartId}-${cartProduct.productId}`}
						cart={initialCart}
						cartProduct={cartProduct}
						localQuantity={
							localQuantities[cartProduct.productId] ?? cartProduct.quantity
						}
						onQuantityChange={handleQuantityChange}
					/>
				))}
			</div>

			<div className='p-4 bg-muted/30 border-t flex justify-between items-center'>
				<p className='text-muted-foreground'>Subtotal</p>
				<p className='font-medium text-lg'>{formatNaira(localSubtotal)}</p>
			</div>
		</div>
	);
};

const CartPage = () => {
	const { accessToken } = useAuthStore();
	const { cartIds: guestCartIds } = useGuestCartStore();
	const isAuthenticated = Boolean(accessToken);

	const { data, isLoading, error } = useCartsQuery({
		enabled: isAuthenticated
	});

	const {
		data: guestCartsData,
		isLoading: isGuestCartLoading,
		error: guestCartsError
	} = useGuestCartsQuery({
		enabled: !isAuthenticated
	});

	const carts = data?.carts || guestCartsData?.carts;
	const isCartLoading = isLoading || isGuestCartLoading;
	const cartError = error || guestCartsError;

	// Show guest cart links for unauthenticated users
	if (!isAuthenticated && guestCartIds.length === 0) {
		return (
			<SignInPrompt
				title='Sign in to view your cart'
				description='Your cart lives in your Habiti account. Sign in to continue shopping or pick up where you left off.'
			/>
		);
	}

	if (isCartLoading) {
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
			</div>
		);
	}

	if (cartError) {
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<div className='text-red-500'>
					Unable to load cart right now. Please try again.
				</div>
			</div>
		);
	}

	if (!carts || carts.length === 0) {
		return (
			<div className='max-w-3xl mx-auto'>
				<h1 className='text-2xl font-medium mb-4'>Cart</h1>
				<div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
					<h2 className='text-xl font-medium mb-2'>Your cart is empty</h2>
					<p className='text-muted-foreground mb-6'>
						Start shopping to add items to your cart
					</p>
					<Button asChild>
						<Link href='/'>Browse stores</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='max-w-3xl mx-auto'>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h1 className='text-2xl font-medium'>Cart</h1>
				</div>
			</div>

			<div className='space-y-6'>
				{carts.map(cart => (
					<CartItem key={cart.id} cart={cart} />
				))}
			</div>
		</div>
	);
};

export default CartPage;

export const runtime = 'edge';
