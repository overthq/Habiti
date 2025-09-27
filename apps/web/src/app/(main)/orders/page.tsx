'use client';

import React from 'react';
import { formatNaira } from '@/utils/currency';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useOrdersQuery } from '@/data/queries';
import { cn } from '@/lib/utils';

const OrdersPage = () => {
	const { data, isLoading } = useOrdersQuery();

	if (isLoading || !data) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Orders</h1>
			<div>
				{data.orders.map(order => (
					<React.Fragment key={order.id}>
						<Link href={`/orders/${order.id}`}>
							<div className='flex justify-between items-center p-4 rounded-lg border'>
								<div className='flex gap-4 items-center'>
									<div className='size-16 rounded-full overflow-hidden bg-muted-foreground flex-shrink-0'>
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
												day: 'numeric'
											})}
										</p>
										<p className='text-sm font-medium mt-1'>
											{formatNaira(order.total)} ·{' '}
											<span
												className={cn(
													'capitalize',
													order.status === 'Completed'
														? 'text-green-600'
														: 'text-amber-600'
												)}
											>
												{order.status}
											</span>
										</p>
									</div>
								</div>
								<ChevronRight className='text-muted-foreground' />
							</div>
						</Link>
						<div className='h-2' />
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default OrdersPage;
