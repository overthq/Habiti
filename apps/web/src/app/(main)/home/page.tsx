'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { gql, useQuery } from 'urql';

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

const HomePage = () => {
	const [{ error, data, fetching }] = useQuery({ query: HOME_QUERY });

	if (fetching) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className='container py-6'>
			<h2 className='text-xl mb-4'>Recent Orders</h2>

			<div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{data.currentUser.orders.map((order: any) => (
					<Link href={`/orders/${order.id}`} key={order.id} className='block'>
						<div className='h-full flex justify-between items-center p-4 rounded-lg border'>
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
										{new Date(Number(order.createdAt)).toLocaleDateString(
											'en-US',
											{
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											}
										)}
									</p>
									<p className='text-sm font-medium mt-1'>
										₦{order.total.toLocaleString()} ·
										<span
											className={`capitalize ml-1 ${order.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}
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

			<h2 className='text-xl mb-4'>Followed Stores</h2>
			<div className='flex overflow-x-auto gap-4 py-4'>
				{data.currentUser.followed.map((followed: any) => (
					<Link
						href={`/store/${followed.store.id}`}
						key={followed.store.id}
						className='flex flex-col items-center min-w-[80px]'
					>
						<div className='w-16 h-16 rounded-full overflow-hidden bg-muted-foreground mb-2'>
							{followed.store.image ? (
								<img
									src={followed.store.image?.path}
									alt={followed.store.name}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full bg-primary-foreground flex items-center justify-center'>
									<span className='text-lg font-bold text-primary'>
										{followed.store.name.charAt(0)}
									</span>
								</div>
							)}
						</div>
						<span className='text-xs text-center truncate w-full'>
							{followed.store.name}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
};

export default HomePage;
