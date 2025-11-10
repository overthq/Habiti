'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import Product from '@/components/store/Product';
import { useStoreQuery } from '@/data/queries';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation
} from '@/data/mutations';
import { Button } from '@/components/ui/button';

interface FollowButtonProps {
	storeId: string;
	isFollowing?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
	storeId,
	isFollowing
}) => {
	const followStoreMutation = useFollowStoreMutation();
	const unfollowStoreMutation = useUnfollowStoreMutation();

	const handleClick = () => {
		if (isFollowing) {
			unfollowStoreMutation.mutate(storeId);
		} else {
			followStoreMutation.mutate(storeId);
		}
	};

	return (
		<Button
			variant='outline'
			disabled={isFollowing === undefined}
			onClick={handleClick}
		>
			{isFollowing ? 'Following' : 'Follow'}
		</Button>
	);
};

const StorePage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useStoreQuery(id);

	if (isLoading || !data) return <div />;

	return (
		<div className='mx-auto'>
			<div className='flex justify-between py-4'>
				<div>
					<div className='rounded-full size-18 overflow-hidden bg-muted mb-4 flex justify-center items-center'>
						{data.store.image ? (
							<img
								src={data.store.image.path}
								className='size-full object-cover'
							/>
						) : (
							<p className='text-2xl font-medium text-muted-foreground'>
								{data.store.name.charAt(0)}
							</p>
						)}
					</div>
					<h1 className='text-3xl font-medium'>{data.store.name}</h1>
					<p className='text-muted-foreground'>{data.store.description}</p>
				</div>
				<FollowButton
					storeId={id}
					isFollowing={data.viewerContext?.isFollowing}
				/>
			</div>
			<div className='mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4'>
				{data.store.products.map(product => (
					<Product key={product.id} {...product} />
				))}
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default StorePage;
