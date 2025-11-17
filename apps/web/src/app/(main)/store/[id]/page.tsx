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
import {
	ChevronDown,
	HeartIcon,
	ListFilterIcon,
	MoreHorizontal
} from 'lucide-react';
import { GetStoreResponse, Store } from '@/data/types';
import { cn } from '@/lib/utils';

const StorePage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useStoreQuery(id);

	if (isLoading || !data) return <div />;

	return (
		<div>
			<StoreHeader store={data.store} viewerContext={data.viewerContext} />

			<div className='mt-4'>
				<h2 className='font-medium'>Products</h2>

				<StoreProductFilters />

				<div className='mt-8 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
					{data.store.products.map(product => (
						<Product key={product.id} {...product} />
					))}
				</div>
			</div>
		</div>
	);
};

const StoreProductFilters = () => {
	return (
		<div className='flex mt-2 gap-2'>
			<Button variant='outline' size='icon'>
				<ListFilterIcon />
			</Button>

			<Button variant='outline'>
				Sort by <ChevronDown />
			</Button>
		</div>
	);
};

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
			className={cn(
				isFollowing &&
					'bg-transparent *:[svg]:fill-red-500 *:[svg]:stroke-red-500'
			)}
		>
			<HeartIcon />
			{isFollowing ? 'Following' : 'Follow'}
		</Button>
	);
};

interface StoreHeaderProps {
	store: Store;
	viewerContext: GetStoreResponse['viewerContext'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store, viewerContext }) => {
	return (
		<div className='flex justify-between py-4'>
			<div>
				<div className='rounded-full size-22 overflow-hidden bg-muted mb-4 flex justify-center items-center'>
					{store.image ? (
						<img src={store.image.path} className='size-full object-cover' />
					) : (
						<p className='text-4xl font-medium text-muted-foreground'>
							{store.name.charAt(0)}
						</p>
					)}
				</div>
				<div className='space-y-2'>
					<h1 className='text-4xl font-medium'>{store.name}</h1>
					<p className='text-muted-foreground'>{store.description}</p>
				</div>
			</div>

			<div className='flex gap-2'>
				<FollowButton
					storeId={store.id}
					isFollowing={viewerContext?.isFollowing}
				/>
				<Button variant='outline'>
					<MoreHorizontal />
				</Button>
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default StorePage;
