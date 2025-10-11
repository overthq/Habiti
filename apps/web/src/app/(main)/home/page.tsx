'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDateFromTimestamp } from '@/utils/date';
import { useFollowedStoresQuery, useOrdersQuery } from '@/data/queries';

const RecentOrders = () => {
	const { isLoading, error, data } = useOrdersQuery();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!data) return null;

	return (
		<div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
			{data.orders.map(order => (
				<Link href={`/orders/${order.id}`} key={order.id} className='block'>
					<div className='h-full flex justify-between items-center p-4 rounded-lg border'>
						<div className='flex gap-4 items-center'>
							<div className='size-14 rounded-full overflow-hidden bg-muted flex-shrink-0'>
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
								<p className='text-sm text-muted-foreground'>
									{formatDateFromTimestamp(order.createdAt)}
								</p>
								<p className='text-sm font-medium mt-1'>
									₦{order.total.toLocaleString()} ·
									<span
										className={cn(
											'capitalize ml-1',
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
					</div>
				</Link>
			))}
		</div>
	);
};

const FollowedStores = () => {
	const { isLoading, error, data } = useFollowedStoresQuery();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!data) return null;

	return (
		<div className='flex overflow-x-auto gap-4 py-1'>
			{data.stores.map(store => (
				<Link
					href={`/store/${store.id}`}
					key={store.id}
					className='flex flex-col items-center min-w-[80px]'
				>
					<div className='size-18 rounded-full overflow-hidden mb-2'>
						{store.image ? (
							<img
								src={store.image?.path}
								alt={store.name}
								className='size-full object-cover'
							/>
						) : (
							<div className='size-full bg-muted-foreground/20 flex items-center justify-center'>
								<span className='text-xl font-medium text-muted-foreground'>
									{store.name.charAt(0)}
								</span>
							</div>
						)}
					</div>
					<span className='text-center truncate w-full font-medium'>
						{store.name}
					</span>
				</Link>
			))}
		</div>
	);
};

const HomePage = () => {
	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Recent Orders</h1>

			<RecentOrders />

			<h2 className='text-xl font-medium mb-4'>Followed Stores</h2>

			<FollowedStores />
		</div>
	);
};

export default HomePage;
