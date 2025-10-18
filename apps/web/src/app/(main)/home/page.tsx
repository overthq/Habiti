'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/utils/date';
import { useFollowedStoresQuery, useOrdersQuery } from '@/data/queries';
import { formatNaira } from '@/utils/currency';
import { OrderStatus } from '@/data/types';
import { Badge } from '@/components/ui/badge';

const OrderStatusToBadgeVariant = {
	[OrderStatus.Pending]: 'warning',
	[OrderStatus.Cancelled]: 'destructive',
	[OrderStatus.Completed]: 'success',
	[OrderStatus.PaymentPending]: 'warning'
} as const;

const OrderStatusToLabel = {
	[OrderStatus.Pending]: 'Pending',
	[OrderStatus.Cancelled]: 'Cancelled',
	[OrderStatus.Completed]: 'Completed',
	[OrderStatus.PaymentPending]: 'Payment Pending'
};

const RecentOrders = () => {
	const { isLoading, error, data } = useOrdersQuery();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!data) return null;

	return (
		<div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
			{data.orders.map(order => (
				<Link href={`/orders/${order.id}`} key={order.id} className='block'>
					<div className='justify-between items-center p-4 rounded-lg border space-y-2'>
						<p className='text-sm text-muted-foreground leading-none'>
							{formatDate(order.createdAt)}
						</p>
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
								<div className='flex gap-2'>
									<p className='font-medium'>{order.store.name}</p>
									<Badge
										className='rounded-full'
										variant={OrderStatusToBadgeVariant[order.status]}
									>
										{OrderStatusToLabel[order.status]}
									</Badge>
								</div>
								<p className='mt-1'>{formatNaira(order.total)}</p>
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
