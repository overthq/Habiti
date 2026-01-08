'use client';

import React from 'react';
import Link from 'next/link';
import { formatNaira } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import SignInPrompt from '@/components/SignInPrompt';
import { useAuthStore } from '@/state/auth-store';
import {
	useCurrentUserQuery,
	useFollowedStoresQuery,
	useOrdersQuery
} from '@/data/queries';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const spanFallback = (label: string) => (
	<span className='text-muted-foreground uppercase'>{label.charAt(0)}</span>
);

const ProfilePage = () => {
	const { accessToken } = useAuthStore();
	const isAuthenticated = Boolean(accessToken);

	const { data: userData, isLoading: isLoadingUser } = useCurrentUserQuery({
		enabled: isAuthenticated
	});

	const { data: followedStoresData, isLoading: isLoadingStores } =
		useFollowedStoresQuery({
			enabled: isAuthenticated
		});

	const { data: ordersData, isLoading: isLoadingOrders } = useOrdersQuery({
		enabled: isAuthenticated
	});

	if (!isAuthenticated) {
		return (
			<SignInPrompt
				title='Sign in to view your profile'
				description='View your details, followed stores, orders, and watchlist by signing in to your Habiti account.'
			/>
		);
	}

	if (isLoadingUser || !userData) {
		return <div />;
	}

	const { user } = userData;

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-medium'>Profile</h1>

			{/* User Details Section */}
			<Card>
				<CardHeader>
					<CardTitle>Your Details</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2'>
					<div>
						<p className='text-sm text-muted-foreground'>Name</p>
						<p className='font-medium'>{user.name}</p>
					</div>
					<div>
						<p className='text-sm text-muted-foreground'>Email</p>
						<p className='font-medium'>{user.email}</p>
					</div>
					<div className='pt-2'>
						<Link
							href='/profile/settings'
							className='text-sm text-primary hover:underline'
						>
							Edit profile →
						</Link>
					</div>
				</CardContent>
			</Card>

			{/* Followed Stores Section */}
			<Card>
				<CardHeader>
					<CardTitle>Followed Stores</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoadingStores ? (
						<div className='text-sm text-muted-foreground'>Loading...</div>
					) : followedStoresData?.stores.length ? (
						<div className='flex gap-4 overflow-x-auto pb-2'>
							{followedStoresData.stores.map(store => (
								<Link
									key={store.id}
									href={`/store/${store.id}`}
									className='flex-shrink-0 rounded-2xl hover:border-foreground/40 transition-colors'
								>
									<div className='items-center justify-center gap-4 w-24 overflow-hidden'>
										<div className='size-24 rounded-full bg-muted flex items-center justify-center overflow-hidden text-3xl font-medium'>
											{store.image?.path ? (
												<img
													src={store.image.path}
													alt={store.name}
													className='size-full object-cover'
												/>
											) : (
												spanFallback(store.name)
											)}
										</div>
										<div className='mt-2'>
											<p className='text-center text-sm truncate'>
												{store.name}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className='text-sm text-muted-foreground'>
							You haven't followed any stores yet.
						</p>
					)}
				</CardContent>
			</Card>

			{/* Previous Orders Section */}
			<Card>
				<CardHeader>
					<CardTitle>Previous Orders</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoadingOrders ? (
						<div className='text-sm text-muted-foreground'>Loading...</div>
					) : ordersData?.orders.length ? (
						<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
							{ordersData.orders.slice(0, 6).map(order => (
								<Link
									className='block'
									href={`/orders/${order.id}`}
									key={order.id}
								>
									<div className='p-4 rounded-lg border space-y-2 hover:bg-muted/50 transition-colors'>
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
													<p>{formatNaira(order.total)}</p>
												</div>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className='text-sm text-muted-foreground'>
							You haven't placed any orders yet.
						</p>
					)}
					{ordersData?.orders.length && ordersData.orders.length > 6 && (
						<div className='mt-4'>
							<Link
								href='/orders'
								className='text-sm text-primary hover:underline'
							>
								View all orders →
							</Link>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Watchlist Section - Placeholder */}
			<Card>
				<CardHeader>
					<CardTitle>Watchlist</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-center py-8'>
						<p className='text-sm text-muted-foreground'>
							Your watchlist will appear here once you start saving products.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProfilePage;
