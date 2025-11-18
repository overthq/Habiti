'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import Product from '@/components/store/Product';
import { useStoreProductsQuery, useStoreQuery } from '@/data/queries';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const StorePage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useStoreQuery(id);

	if (isLoading || !data) return <div />;

	return (
		<div>
			<StoreHeader store={data.store} viewerContext={data.viewerContext} />

			<StoreProducts storeId={data.store.id} />
		</div>
	);
};

type StoreProductsSortOption =
	| 'default'
	| 'newest-to-oldest'
	| 'highest-to-lowest-price'
	| 'lowest-to-highest-price';

interface StoreProductFiltersProps {
	sortBy: StoreProductsSortOption;
	onSortChange: (value: StoreProductsSortOption) => void;
}

const StoreProductFilters: React.FC<StoreProductFiltersProps> = ({
	sortBy,
	onSortChange
}) => {
	return (
		<div className='flex mt-2 gap-2'>
			<Button variant='outline' size='icon'>
				<ListFilterIcon />
			</Button>

			<Popover>
				<PopoverTrigger asChild>
					<Button variant='outline'>
						Sort by <ChevronDown />
					</Button>
				</PopoverTrigger>
				<PopoverContent align='start' className='w-[220px]'>
					<div>
						<RadioGroup
							value={sortBy}
							onValueChange={value =>
								onSortChange(value as StoreProductsSortOption)
							}
						>
							<div className='flex items-center gap-3'>
								<RadioGroupItem value='default' id='default' />
								<Label htmlFor='default'>Default</Label>
							</div>
							<div className='flex items-center gap-3'>
								<RadioGroupItem
									value='newest-to-oldest'
									id='newest-to-oldest'
								/>
								<Label htmlFor='newest-to-oldest'>Newest to oldest</Label>
							</div>
							<div className='flex items-center gap-3'>
								<RadioGroupItem
									value='highest-to-lowest-price'
									id='highest-to-lowest-price'
								/>
								<Label htmlFor='highest-to-lowest-price'>
									Highest to lowest price
								</Label>
							</div>
							<div className='flex items-center gap-3'>
								<RadioGroupItem
									value='lowest-to-highest-price'
									id='lowest-to-highest-price'
								/>
								<Label htmlFor='lowest-to-highest-price'>
									Lowest to highest price
								</Label>
							</div>
						</RadioGroup>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

interface StoreProductsProps {
	storeId: string;
}

const StoreProducts: React.FC<StoreProductsProps> = ({ storeId }) => {
	const [sortBy, setSortBy] =
		React.useState<StoreProductsSortOption>('default');

	const queryParams = React.useMemo(() => {
		const params = new URLSearchParams();

		const sortMap: Partial<Record<StoreProductsSortOption, [string, string]>> =
			{
				'newest-to-oldest': ['orderBy[createdAt]', 'desc'],
				'highest-to-lowest-price': ['orderBy[unitPrice]', 'desc'],
				'lowest-to-highest-price': ['orderBy[unitPrice]', 'asc']
			};

		const sortValue = sortMap[sortBy];

		if (sortValue) {
			params.set(sortValue[0], sortValue[1]);
		}

		return params;
	}, [sortBy]);

	const { data, isLoading } = useStoreProductsQuery(storeId, queryParams);

	return (
		<div className='mt-4'>
			<h2 className='font-medium'>Products</h2>

			<StoreProductFilters sortBy={sortBy} onSortChange={setSortBy} />

			<div className='mt-8 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
				{isLoading
					? Array.from({ length: 6 }).map((_, index) => (
							<Skeleton key={index} className='aspect-square rounded-lg' />
						))
					: data?.products.map(product => (
							<Product key={product.id} {...product} />
						))}
			</div>
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
