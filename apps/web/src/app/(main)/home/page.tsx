'use client';

import React from 'react';
import Link from 'next/link';
import { gql, useQuery } from 'urql';
import { cn } from '@/lib/utils';
import { formatDateFromTimestamp } from '@/utils/date';

const HomePage = () => {
	const [{ error, data, fetching }] = useQuery({ query: HOME_QUERY });

	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<h1 className='text-2xl font-medium mb-4'>Recent Orders</h1>

			<div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{data.currentUser.orders.map((order: any) => (
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

			<h2 className='text-xl font-medium mb-4'>Followed Stores</h2>

			<div className='flex overflow-x-auto gap-4 py-1'>
				{data.currentUser.followed.map((followed: any) => (
					<Link
						href={`/store/${followed.store.id}`}
						key={followed.store.id}
						className='flex flex-col items-center min-w-[80px]'
					>
						<div className='size-18 rounded-full overflow-hidden mb-2'>
							{followed.store.image ? (
								<img
									src={followed.store.image?.path}
									alt={followed.store.name}
									className='size-full object-cover'
								/>
							) : (
								<div className='size-full bg-muted-foreground/20 flex items-center justify-center'>
									<span className='text-xl font-medium text-muted-foreground'>
										{followed.store.name.charAt(0)}
									</span>
								</div>
							)}
						</div>
						<span className='text-center truncate w-full font-medium'>
							{followed.store.name}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
};

const HOME_QUERY = gql`
	query Home {
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

			followed {
				storeId
				followerId
				store {
					id
					name
					image {
						id
						path
					}
				}
			}

			watchlist {
				userId
				productId
				product {
					id
					name
					unitPrice
					store {
						id
						name
					}
					images {
						id
						path
					}
				}
			}
		}
	}
`;

export default HomePage;
