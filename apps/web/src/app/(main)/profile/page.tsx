'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Settings, Store } from 'lucide-react';
import { formatNaira } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import SignInPrompt from '@/components/SignInPrompt';
import { useAuthStore } from '@/state/auth-store';
import {
	useCurrentUserQuery,
	useFollowedStoresQuery,
	useOrdersQuery
} from '@/data/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

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
		return (
			<div className='space-y-6'>
				<div className='flex items-center gap-4'>
					<Skeleton className='size-16 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-5 w-32' />
						<Skeleton className='h-4 w-48' />
					</div>
				</div>
				<Skeleton className='h-40 w-full rounded-xl' />
				<Skeleton className='h-40 w-full rounded-xl' />
			</div>
		);
	}

	const { user } = userData;
	const initials = user.name
		.split(' ')
		.map((n: string) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className='max-w-3xl mx-auto space-y-6 pb-8'>
			{/* Profile Header */}
			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<Avatar className='size-16 text-3xl font-semibold'>
						<AvatarImage src={undefined} alt={user.name} />
						<AvatarFallback className='bg-primary/10 text-primary'>
							{initials}
						</AvatarFallback>
					</Avatar>
					<div>
						<h1 className='text-xl font-semibold leading-tight'>{user.name}</h1>
						<p className='text-sm text-muted-foreground'>{user.email}</p>
					</div>
				</div>
				<Button variant='outline' size='sm' asChild>
					<Link href='/profile/settings'>
						<Settings />
						Edit
					</Link>
				</Button>
			</div>

			<Separator />

			{/* Followed Stores */}
			<Card className='shadow-none border-none'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Followed stores
					</CardTitle>
					{followedStoresData?.stores.length ? (
						<CardAction>
							<Badge variant='secondary'>
								{followedStoresData.stores.length}
							</Badge>
						</CardAction>
					) : null}
				</CardHeader>
				<CardContent>
					{isLoadingStores ? (
						<div className='flex gap-4'>
							{[...Array(3)].map((_, i) => (
								<div key={i} className='flex flex-col items-center gap-2'>
									<Skeleton className='size-16 rounded-full' />
									<Skeleton className='h-3 w-14' />
								</div>
							))}
						</div>
					) : followedStoresData?.stores.length ? (
						<div className='flex gap-5 overflow-x-auto pb-1'>
							{followedStoresData.stores.map(store => (
								<Link
									key={store.id}
									href={`/store/${store.id}`}
									className='flex flex-col items-center gap-2 shrink-0 group'
								>
									<Avatar className='size-16 ring-2 ring-transparent group-hover:ring-primary/30 transition-all'>
										<AvatarImage
											src={store.image?.path}
											alt={store.name}
											className='object-cover'
										/>
										<AvatarFallback className='text-base font-medium bg-muted'>
											{store.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<p className='text-xs text-center w-16 truncate text-muted-foreground group-hover:text-foreground transition-colors'>
										{store.name}
									</p>
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

			{/* Recent Orders */}
			<Card className='shadow-none border-none'>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						Recent orders
					</CardTitle>
					{ordersData?.orders.length ? (
						<CardAction>
							<Button variant='ghost' size='xs' asChild>
								<Link href='/orders'>
									View all
									<ArrowRight />
								</Link>
							</Button>
						</CardAction>
					) : null}
				</CardHeader>
				<CardContent>
					{isLoadingOrders ? (
						<div className='space-y-3'>
							{[...Array(3)].map((_, i) => (
								<div key={i} className='flex items-center gap-3'>
									<Skeleton className='size-10 rounded-full shrink-0' />
									<div className='flex-1 space-y-1.5'>
										<Skeleton className='h-4 w-32' />
										<Skeleton className='h-3 w-20' />
									</div>
									<Skeleton className='h-4 w-16' />
								</div>
							))}
						</div>
					) : ordersData?.orders.length ? (
						<div className='space-y-1'>
							{ordersData.orders.slice(0, 6).map((order, index) => (
								<React.Fragment key={order.id}>
									{index > 0 && <Separator className='my-1' />}
									<Link
										href={`/orders/${order.id}`}
										className='flex items-center gap-3 py-2 rounded-lg hover:bg-muted/50 transition-colors px-2 -mx-2 group'
									>
										<Avatar className='size-10 shrink-0'>
											<AvatarImage
												src={order.store.image?.path}
												alt={order.store.name}
												className='object-cover'
											/>
											<AvatarFallback className='text-xs font-medium'>
												{order.store.name.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 min-w-0'>
											<p className='font-medium text-sm truncate'>
												{order.store.name}
											</p>
											<p className='text-xs text-muted-foreground'>
												{formatDate(order.createdAt)}
											</p>
										</div>
										<div className='text-right shrink-0'>
											<p className='text-sm font-medium'>
												{formatNaira(order.total)}
											</p>
										</div>
									</Link>
								</React.Fragment>
							))}
						</div>
					) : (
						<p className='text-sm text-muted-foreground'>
							You haven't placed any orders yet.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default ProfilePage;
