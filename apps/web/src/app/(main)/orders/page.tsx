'use client';

import React from 'react';
import { formatNaira } from '@/utils/currency';
import Link from 'next/link';
import { useOrdersQuery } from '@/data/queries';
import { formatDate } from '@/utils/date';

const OrdersPage = () => {
	const { data, isLoading } = useOrdersQuery();

	if (isLoading || !data) {
		return <div />;
	}

	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Orders</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
				{data.orders.map(order => (
					<Link className='block' href={`/orders/${order.id}`} key={order.id}>
						<div className='p-4 rounded-lg border space-y-2'>
							<p className='text-sm text-muted-foreground leading-none'>
								{formatDate(order.createdAt)}
							</p>
							<div className='flex flex-1 justify-between items-center'>
								<div className='flex gap-4 items-center'>
									<div className='size-14 rounded-full overflow-hidden bg-muted-foreground/20 flex-shrink-0'>
										{order.store.image && (
											<img
												src={order.store.image?.path}
												alt={order.store.name}
												className='size-full object-cover'
											/>
										)}
									</div>
									<div>
										<p className='font-medium'>{order.store.name}</p>
										{/* <p className='text-sm text-muted-foreground'>
											{order.products.length} items
										</p> */}
										<p>{formatNaira(order.total)}</p>
									</div>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default OrdersPage;
