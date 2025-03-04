'use client';

import { formatNaira } from '@/utils/currency';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { gql, useQuery } from 'urql';

const ORDERS_QUERY = gql`
	query Orders {
		currentUser {
			id
			orders {
				id
				store {
					id
					name
					image {
						id
						path
					}
				}
				products {
					orderId
					productId
					product {
						id
						name
					}
					unitPrice
					quantity
				}
				total
				status
				createdAt
			}
		}
	}
`;

const OrdersPage = () => {
	const [{ data, fetching }] = useQuery({ query: ORDERS_QUERY });

	if (fetching) {
		return <p>Loading...</p>;
	}

	return (
		<div className='container py-6'>
			<h1 className='text-2xl font-bold mb-8'>Orders</h1>
			<div className='space-y-4'>
				{data?.currentUser.orders.map((order: any) => (
					<Link href={`/orders/${order.id}`} key={order.id}>
						<div className='flex justify-between items-center p-4 rounded-lg border hover:shadow-md transition-shadow'>
							<div className='flex gap-4 items-center'>
								<div className='w-16 h-16 rounded-full overflow-hidden bg-muted-foreground flex-shrink-0'>
									{order.store.image && (
										<img
											src={order.store.image?.path}
											alt={order.store.name}
											className='size-full object-cover'
										/>
									)}
								</div>

								<div>
									<p className='font-medium'>
										{order.store.name} -{' '}
										<span className='text-primary'>
											{order.products.length} items
										</span>
									</p>
									<p className='text-sm text-muted-foreground'>
										{new Date(order.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
									<p className='text-sm font-medium mt-1'>
										{formatNaira(order.total)} ·{' '}
										<span
											className={`capitalize ${order.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}
										>
											{order.status}
										</span>
									</p>
								</div>
							</div>
							<ChevronRight className='text-muted-foreground' />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default OrdersPage;
