'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import CartContextWrapper, { useCart } from '@/contexts/CartContext';
import { CartProduct } from '@/data/types';
import { formatNaira } from '@/utils/currency';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldTitle
} from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/utils/date';

const CardSelector = () => {
	const { cards, selectedCard, setSelectedCard } = useCart();

	if (cards.length === 0) {
		return (
			<Alert>
				<AlertDescription>
					You do not currently have any cards added to your account. Clicking
					the "Place order" button below will give you the opportunity to add
					one while you pay.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div>
			<FieldGroup>
				<FieldSet>
					<FieldLabel className='text-lg'>Payment Method</FieldLabel>
					<FieldDescription>
						Choose how you want to pay for this order.
					</FieldDescription>
					<RadioGroup value={selectedCard} onValueChange={setSelectedCard}>
						{cards.map(card => (
							<FieldLabel key={card.id} htmlFor={card.id}>
								<Field orientation='horizontal'>
									<RadioGroupItem
										value={card.id}
										id={card.id}
										aria-label={card.cardType}
									/>
									<FieldContent>
										<FieldTitle className='capitalize'>
											{card.cardType}
										</FieldTitle>
										<FieldDescription>Ends with {card.last4}</FieldDescription>
									</FieldContent>
								</Field>
							</FieldLabel>
						))}
						<FieldLabel htmlFor='new-card'>
							<Field orientation='horizontal'>
								<RadioGroupItem
									value='new-card'
									id='new-card'
									aria-label='New payment method'
								/>
								<FieldContent>
									<FieldTitle className='capitalize'>
										New payment method
									</FieldTitle>
									<FieldDescription>Create new payment method</FieldDescription>
								</FieldContent>
							</Field>
						</FieldLabel>
					</RadioGroup>
				</FieldSet>
			</FieldGroup>
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
		<div className='max-w-3xl mx-auto'>
			<Link
				href='/carts'
				className='flex gap-2 items-center text-muted-foreground text-sm mb-8'
			>
				<ArrowLeft className='size-4' /> <p>Back to carts</p>
			</Link>

			<div className='flex items-center gap-3 mb-6'>
				<div className='size-14 rounded-full bg-muted flex items-center justify-center'>
					{cart.store.image ? (
						<img
							src={cart.store.image.path}
							className='size-full object-cover'
						/>
					) : (
						<p className='text-muted-foreground uppercase font-medium text-xl'>
							{cart.store.name[0]}
						</p>
					)}
				</div>
				<div>
					<p className='text-lg font-medium'>{cart.store.name}</p>
					<p className='text-muted-foreground text-sm'>
						Created on {formatDate(cart.createdAt)}
					</p>
				</div>
			</div>

			<h2 className='text-lg font-medium my-2'>Products</h2>

			<div className='border rounded-lg'>
				{cart.products.map(cartProduct => (
					<div
						key={`${cartProduct.cartId}-${cartProduct.productId}`}
						className='flex items-center gap-2.5 p-2 not-last:border-b'
					>
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
						<div className='flex-1'>
							<p>{cartProduct.product.name}</p>
							<p
								className={cn(
									'text-muted-foreground',
									cartProduct.quantity > cartProduct.product.quantity &&
										'text-destructive'
								)}
							>
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

			<Separator className='my-4' />

			<CardSelector />

			<Separator className='my-4' />

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
		<CartContextWrapper>
			<CartMain />
		</CartContextWrapper>
	);
};

export default CartPage;

export const runtime = 'edge';
