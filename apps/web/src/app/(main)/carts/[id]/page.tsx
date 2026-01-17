'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import CartContextWrapper, { useCart } from '@/contexts/CartContext';
import { formatNaira } from '@/utils/currency';
import { AlertCircleIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSet
} from '@/components/ui/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/utils/date';

const CardSelector = () => {
	const { cards, selectedCard, setSelectedCard } = useCart();

	const hasNoCards = cards.length === 0;
	const hasNoSelection = !selectedCard;

	return (
		<div>
			<FieldGroup>
				<FieldSet>
					<FieldLegend className='text-lg'>Payment Method</FieldLegend>

					{!hasNoCards && (
						<FieldDescription>
							Choose how you want to pay for this order.
						</FieldDescription>
					)}

					{(hasNoCards || hasNoSelection) && (
						<Alert>
							<AlertCircleIcon className='size-4' />
							<AlertTitle>No saved payment methods</AlertTitle>
							<AlertDescription>
								{hasNoCards
									? 'You do not currently have any cards added to your account. Clicking the "Place order" button below will give you the opportunity to add one while you pay.'
									: 'You have not selected a payment method. Clicking the "Place order" button below will give you the opportunity to add one while you pay.'}
							</AlertDescription>
						</Alert>
					)}

					{!hasNoCards && (
						<Select value={selectedCard || ''} onValueChange={setSelectedCard}>
							<SelectTrigger className='w-[200px]'>
								<SelectValue placeholder='Select a payment method' />
							</SelectTrigger>
							<SelectContent>
								{cards.map(card => (
									<SelectItem key={card.id} value={card.id}>
										{card.cardType.charAt(0).toUpperCase() +
											card.cardType.slice(1).toLowerCase()}{' '}
										*{card.last4}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</FieldSet>
			</FieldGroup>
		</div>
	);
};

const CartMain = () => {
	const { cart, handleSubmit, disabled, isPlacingOrder } = useCart();

	return (
		<div className='max-w-3xl mx-auto'>
			<Link
				href='/cart'
				className='flex gap-2 items-center text-muted-foreground text-sm mb-8'
			>
				<ArrowLeft className='size-4' /> <p>Back to cart</p>
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

			<h2 className='font-medium my-2'>Summary</h2>

			<div>
				{cart.products.map(cartProduct => (
					<div
						key={`${cartProduct.cartId}-${cartProduct.productId}`}
						className='flex items-center gap-3'
					>
						<div className='size-14 bg-muted rounded-md flex items-center justify-center overflow-hidden'>
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
							{/* <p
								className={cn(
									'text-muted-foreground',
									cartProduct.quantity > cartProduct.product.quantity &&
										'text-destructive'
								)}
							>
								{cartProduct.quantity}{' '}
								{cartProduct.quantity === 1 ? 'unit' : 'units'}
							</p> */}
						</div>

						<div>
							<p>
								{formatNaira(
									cartProduct.product.unitPrice * cartProduct.quantity
								)}
							</p>
						</div>
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
				{isPlacingOrder ? <Loader2 className='size-4 animate-spin' /> : null}
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
