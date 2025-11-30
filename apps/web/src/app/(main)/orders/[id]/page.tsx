'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatNaira } from '@/utils/currency';
import { useOrderQuery } from '@/data/queries';
import { formatDate } from '@/utils/date';
import { ArrowLeft } from 'lucide-react';
import SignInPrompt from '@/components/SignInPrompt';
import { useAuthStore } from '@/state/auth-store';

const OrderPage = () => {
	const { id } = useParams<{ id: string }>();
	const { accessToken } = useAuthStore();
	const isAuthenticated = Boolean(accessToken);
	const { data, isLoading } = useOrderQuery(id, {
		enabled: isAuthenticated && Boolean(id)
	});

	if (!isAuthenticated) {
		return (
			<SignInPrompt
				title='Sign in to view this order'
				description='Order details are only available to the customer who placed them. Please sign in to continue.'
			/>
		);
	}

	if (isLoading || !data) {
		return <div />;
	}

	const { order } = data;

	return (
		<div className='mx-auto'>
			<Link
				href='/orders'
				className='flex gap-2 items-center text-muted-foreground text-sm mb-8'
			>
				<ArrowLeft className='size-4' /> <p>Back to orders</p>
			</Link>

			<div>
				<Link href={`/store/${order.store.id}`}>
					<div className='flex items-center gap-2'>
						<div className='size-14 rounded-full bg-muted flex items-center justify-center overflow-hidden'>
							{order.store.image ? (
								<img
									src={order.store.image.path}
									alt={order.store.name}
									className='size-14 object-cover rounded-md'
								/>
							) : (
								<p className='text-muted-foreground uppercase font-medium text-xl'>
									{order.store.name.charAt(0)}
								</p>
							)}
						</div>
						<div>
							<p className='text-lg font-medium'>{order.store.name}</p>
							<p className='text-muted-foreground text-sm'>
								Created on {formatDate(order.createdAt)}
							</p>
						</div>
					</div>
				</Link>
			</div>

			<div className='border rounded-lg mt-4'>
				{order.products.map(({ product, productId, unitPrice, quantity }) => (
					<div
						key={productId}
						className='flex items-center p-2.5 gap-2.5 not-last:border-b'
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

			<div className='border rounded-md p-4 bg-muted my-4'>
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
