'use client';

import { Button } from '@/components/ui/button';
import { useCreateOrderMutation } from '@/data/mutations';
import { useCartQuery } from '@/data/queries';
import { formatNaira } from '@/utils/currency';
import { useParams } from 'next/navigation';

const CartPage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useCartQuery(id);

	const createOrderMutation = useCreateOrderMutation();

	const handlePlaceOrder = () => {
		if (data) {
			createOrderMutation.mutate({
				cartId: id,
				cardId: data.cart.user.cards[0].id,
				transactionFee: data.cart.fees.transaction,
				serviceFee: data.cart.fees.service
			});
		}
	};

	if (isLoading || !data) {
		return <div />;
	}

	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Cart</h1>

			<div className='border rounded-md'>
				{data.cart.products.map(product => (
					<div
						key={product.productId}
						className='flex items-center gap-3 p-3 not-last:border-b'
					>
						<div className='size-14 bg-muted rounded flex items-center justify-center'>
							{product.product.images[0] && (
								<img
									src={product.product.images[0].path}
									alt={product.product.name}
									className='size-full object-cover rounded'
									loading='lazy'
									onLoad={e =>
										e.currentTarget.parentElement?.classList.remove(
											'bg-gray-200'
										)
									}
								/>
							)}
						</div>
						<div className='flex-1'>
							<p>{product.product.name}</p>
							<p className='text-muted-foreground'>
								{formatNaira(product.product.unitPrice * product.quantity)}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className='my-4 border rounded-md p-4 bg-muted'>
				<div className='flex justify-between'>
					<p>Subtotal</p>
					<p>{formatNaira(data.cart.total)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Transaction Fee</p>
					<p>{formatNaira(data.cart.fees.transaction)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Service Fee</p>
					<p>{formatNaira(data.cart.fees.service)}</p>
				</div>
				<div className='flex font-medium justify-between'>
					<p>Total</p>
					<p>{formatNaira(data.cart.fees.total + data.cart.total)}</p>
				</div>
			</div>

			<Button onClick={handlePlaceOrder}>Place Order</Button>
		</div>
	);
};

export default CartPage;

export const runtime = 'edge';
