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
import { ChevronDown, HeartIcon } from 'lucide-react';
import { GetStoreResponse, Store, StoreProductCategory } from '@/data/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const StorePage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useStoreQuery(id);

	if (isLoading || !data) return <div />;

	return (
		<div>
			<StoreHeader store={data.store} viewerContext={data.viewerContext} />

			<StoreProducts
				storeId={data.store.id}
				categories={data.store.categories}
			/>
		</div>
	);
};

type StoreProductsSortOption =
	| 'default'
	| 'newest-to-oldest'
	| 'highest-to-lowest-price'
	| 'lowest-to-highest-price';

interface StoreProductFiltersProps extends React.PropsWithChildren {
	sortBy: StoreProductsSortOption;
	onSortChange: (value: StoreProductsSortOption) => void;
}

const StoreProductFilters: React.FC<StoreProductFiltersProps> = ({
	sortBy,
	onSortChange,
	children
}) => {
	return (
		<div className='flex mt-2 gap-2'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='sm'>
						Sort by <ChevronDown />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'default'}
						onCheckedChange={() => onSortChange('default')}
					>
						Default
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'newest-to-oldest'}
						onCheckedChange={() => onSortChange('newest-to-oldest')}
					>
						Newest to oldest
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'highest-to-lowest-price'}
						onCheckedChange={() => onSortChange('highest-to-lowest-price')}
					>
						Highest to lowest price
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={sortBy === 'lowest-to-highest-price'}
						onCheckedChange={() => onSortChange('lowest-to-highest-price')}
					>
						Lowest to highest price
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{children}

			<Button variant='outline' size='sm'>
				In stock
			</Button>
		</div>
	);
};

interface StoreCategoriesProps {
	categories: StoreProductCategory[];
	selectedCategory: string | null;
	onCategoryChange: (categoryId: string | null) => void;
}

const StoreCategories: React.FC<StoreCategoriesProps> = ({
	categories,
	selectedCategory,
	onCategoryChange
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='sm'>
					Category
					<ChevronDown />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start'>
				<DropdownMenuCheckboxItem
					checked={selectedCategory === null}
					onCheckedChange={() => onCategoryChange(null)}
				>
					All
				</DropdownMenuCheckboxItem>

				{categories.map(category => (
					<DropdownMenuCheckboxItem
						key={category.id}
						checked={selectedCategory === category.id}
						onCheckedChange={() => onCategoryChange(category.id)}
					>
						{category.name}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

interface StoreProductsProps {
	storeId: string;
	categories: StoreProductCategory[];
}

const StoreProducts: React.FC<StoreProductsProps> = ({
	storeId,
	categories
}) => {
	const [sortBy, setSortBy] =
		React.useState<StoreProductsSortOption>('default');
	const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
		null
	);

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

		if (selectedCategory) {
			params.set('categoryId', selectedCategory);
		}

		return params;
	}, [sortBy, selectedCategory]);

	const { data, isLoading } = useStoreProductsQuery(storeId, queryParams);

	return (
		<div className='mt-4 space-y-3'>
			<h2 className='text-lg font-medium mb-4'>Products</h2>

			<StoreProductFilters sortBy={sortBy} onSortChange={setSortBy}>
				<StoreCategories
					categories={categories}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
				/>
			</StoreProductFilters>

			<div className='mt-6 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4'>
				{isLoading
					? Array.from({ length: 6 }).map((_, index) => (
							<Skeleton key={index} className='aspect-square rounded-lg' />
						))
					: data?.products.map(product => (
							<Product
								key={product.id}
								id={product.id}
								name={product.name}
								unitPrice={product.unitPrice}
								imagePath={product.images[0]?.path}
								inGrid
							/>
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
			size='sm'
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
			<div className='flex items-center gap-4'>
				<div className='rounded-full size-24 overflow-hidden bg-muted flex justify-center items-center'>
					{store.image ? (
						<img src={store.image.path} className='size-full object-cover' />
					) : (
						<p className='text-4xl font-medium text-muted-foreground'>
							{store.name.charAt(0)}
						</p>
					)}
				</div>
				<div className='space-y-1'>
					<h1 className='text-2xl font-medium'>{store.name}</h1>
					<p className='text-muted-foreground'>{store.description}</p>
				</div>
			</div>

			<div className='flex gap-2'>
				<FollowButton
					storeId={store.id}
					isFollowing={viewerContext?.isFollowing}
				/>
			</div>
		</div>
	);
};

export const runtime = 'edge';

export default StorePage;
