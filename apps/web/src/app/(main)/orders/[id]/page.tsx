'use client';

import { useParams } from 'next/navigation';
import { formatNaira } from '@/utils/currency';
import { useOrderQuery } from '@/data/queries';

const OrderPage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useOrderQuery(id);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	const order = data?.order;
	if (!order) {
		return <p>Order not found</p>;
	}

	return (
		<div className='mx-auto'>
			<h1 className='text-2xl font-medium mb-4'>Order Details</h1>

			<div className='border rounded-lg'>
				{order.products.map(({ product, productId, unitPrice, quantity }) => (
					<div
						key={productId}
						className='flex items-center p-3 gap-3 not-last:border-b'
					>
						<div className='size-14 bg-muted rounded-md flex items-center justify-center overflow-hidden'>
							{product.images?.[0] && (
								<img
									src={product.images[0].path}
									alt={product.name}
									className='size-14 object-cover rounded-md'
								/>
							)}
						</div>
						<div className='flex-1'>
							<p>{product.name}</p>
							<div className='text-muted-foreground'>
								<p>{formatNaira(unitPrice * quantity)}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className=' border rounded-md p-4 bg-muted my-4'>
				<div className='flex justify-between'>
					<p>Subtotal</p>
					<p>
						{formatNaira(
							order.total - (order.transactionFee + order.serviceFee)
						)}
					</p>
				</div>
				<div className='flex justify-between'>
					<p>Transaction Fee</p>
					<p>{formatNaira(order.transactionFee)}</p>
				</div>
				<div className='flex justify-between'>
					<p>Service Fee</p>
					<p>{formatNaira(order.serviceFee)}</p>
				</div>
				<div className='flex font-medium justify-between'>
					<p>Total</p>
					<p>{formatNaira(order.total)}</p>
				</div>
			</div>
		</div>
	);
};

export default OrderPage;

export const runtime = 'edge';
