'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import CartProvider, { useCart } from '@/contexts/CartContext';
import { useCardsQuery } from '@/data/queries';
import { CartProduct } from '@/data/types';
import { cn } from '@/lib/utils';
import { formatNaira } from '@/utils/currency';
import { Minus, Plus } from 'lucide-react';

const CardSelector = () => {
	const { selectedCard, setSelectedCard } = useCart();

	const { data, isLoading } = useCardsQuery();

	if (!data || isLoading) {
		return <div />;
	}

	return (
		<div className='pt-4'>
			<h2 className='text-lg font-medium mb-2'>Payment Method</h2>
			{data?.cards.map(card => (
				<div
					onClick={() => setSelectedCard(card.id)}
					key={card.id}
					className={cn(
						'border rounded-md p-4',
						selectedCard === card.id && 'bg-muted'
					)}
				>
					<p className='capitalize'>{`${card.cardType} \u2022\u2022\u2022\u2022${card.last4}`}</p>
				</div>
			))}
		</div>
	);
};

interface CartProductQuantityProps {
	cartProduct: CartProduct;
	quantity: number;
	maxQuantity: number;
}

const CartProductQuantity: React.FC<CartProductQuantityProps> = ({
	cartProduct,
	quantity,
	maxQuantity
}) => {
	const { updateProductQuantity } = useCart();

	const incrementProductQuantity = React.useCallback(() => {
		updateProductQuantity(cartProduct.productId, quantity + 1);
	}, [cartProduct.productId, quantity, updateProductQuantity]);

	const decrementProductQuantity = React.useCallback(() => {
		updateProductQuantity(cartProduct.productId, Math.max(quantity - 1, 0));
	}, [cartProduct.productId, quantity, updateProductQuantity]);

	return (
		<div className='flex items-center gap-2'>
			<Button size='sm' variant='outline' onClick={decrementProductQuantity}>
				<Minus size={20} />
			</Button>
			<p className='font-medium text-center w-6'>{quantity}</p>
			<Button size='sm' variant='outline' onClick={incrementProductQuantity}>
				<Plus size={20} />
			</Button>
		</div>
	);
};

const CartMain = () => {
	const { cart, handleSubmit, disabled } = useCart();

	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Cart</h1>

			<div>
				<p className='text-lg font-medium mb-2'>{cart.store.name}</p>
			</div>

			<div className='border rounded-md'>
				{cart.products.map(cartProduct => (
					<div
						key={`${cartProduct.cartId}-${cartProduct.productId}`}
						className='flex items-center gap-3 p-3 not-last:border-b'
					>
						<div className='size-14 bg-muted rounded flex items-center justify-center'>
							{cartProduct.product.images[0] && (
								<img
									src={cartProduct.product.images[0].path}
									alt={cartProduct.product.name}
									className='size-full object-cover rounded'
									loading='lazy'
								/>
							)}
						</div>
						<div className='flex-1'>
							<p>{cartProduct.product.name}</p>
							<p className='text-muted-foreground'>
								{formatNaira(
									cartProduct.product.unitPrice * cartProduct.quantity
								)}
							</p>
						</div>

						<CartProductQuantity
							cartProduct={cartProduct}
							quantity={cartProduct.quantity}
							maxQuantity={cartProduct.product.quantity}
						/>
					</div>
				))}
			</div>

			<CardSelector />

			<div className='my-4 border rounded-md p-4 bg-muted'>
				<div className='flex justify-between'>
					<p>Subtotal</p>
					<p>{formatNaira(cart.total)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Transaction Fee</p>
					<p>{formatNaira(cart.fees.transaction)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Service Fee</p>
					<p>{formatNaira(cart.fees.service)}</p>
				</div>
				<div className='flex font-medium justify-between'>
					<p>Total</p>
					<p>{formatNaira(cart.fees.total + cart.total)}</p>
				</div>
			</div>

			<Button disabled={disabled} onClick={handleSubmit}>
				Place Order
			</Button>
		</div>
	);
};

const CartPage = () => {
	return (
		<CartProvider>
			<CartMain />
		</CartProvider>
	);
};

export default CartPage;

export const runtime = 'edge';
