'use client';

import Link from 'next/link';
import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useLandingHighlightsQuery } from '@/data/queries';
import { Product as ProductType, Store } from '@/data/types';
import {
	useRecentlyViewedStore,
	RecentlyViewedProduct
} from '@/state/recently-viewed-store';
import Product from '@/components/store/Product';

const HomePage = () => {
	const { data, isLoading } = useLandingHighlightsQuery();
	const recentlyViewedProducts = useRecentlyViewedStore(
		state => state.products
	);

	return (
		<div className='space-y-8'>
			<TrendingStoresSection
				stores={data?.trendingStores ?? []}
				isLoading={isLoading}
			/>

			<FeaturedProductsSection
				products={data?.featuredProducts ?? []}
				isLoading={isLoading}
			/>

			<RecentlyViewedSection products={recentlyViewedProducts} />
		</div>
	);
};

interface SectionProps {
	title: string;
}

const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({
	title,
	children
}) => {
	return (
		<section className='space-y-4'>
			<div className='flex flex-wrap items-end justify-between gap-4'>
				<div>
					<h2 className='text-xl font-medium'>{title}</h2>
				</div>
			</div>
			{children}
		</section>
	);
};

interface TrendingStoresSectionProps {
	stores: Store[];
	isLoading: boolean;
}

const TrendingStoresSection: React.FC<TrendingStoresSectionProps> = ({
	stores,
	isLoading
}) => {
	return (
		<Section title='Trending stores'>
			{isLoading ? (
				<TrendingStoresSkeleton />
			) : stores.length ? (
				<div className='flex gap-4 overflow-x-auto'>
					{stores.map(store => (
						<StoreCard key={store.id} store={store} />
					))}
				</div>
			) : (
				<EmptyState message='No stores to show yet. Check back shortly!' />
			)}
		</Section>
	);
};

interface StoreCardProps {
	store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
	return (
		<Link
			href={`/store/${store.id}`}
			className='rounded-2xl hover:border-foreground/40 transition-colors'
		>
			<div className='items-center justify-center gap-4 w-24 overflow-hidden'>
				<div className='size-24 rounded-full bg-muted flex items-center justify-center overflow-hidden text-3xl font-semibold'>
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
					<p className='text-center text-sm truncate'>{store.name}</p>
				</div>
			</div>
		</Link>
	);
};

const spanFallback = (label: string) => (
	<span className='text-muted-foreground'>{label.charAt(0)}</span>
);

const TrendingStoresSkeleton = () => (
	<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
		{Array.from({ length: 3 }).map((_, index) => (
			<div key={index} className='rounded-2xl border p-5 space-y-4'>
				<div className='flex items-center gap-4'>
					<Skeleton className='size-14 rounded-xl' />
					<div className='space-y-2 flex-1'>
						<Skeleton className='h-4 w-3/4' />
						<Skeleton className='h-3 w-full' />
					</div>
				</div>
				<Skeleton className='h-4 w-1/3' />
			</div>
		))}
	</div>
);

interface FeaturedProductsSectionProps {
	products: ProductType[];
	isLoading: boolean;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
	products,
	isLoading
}) => {
	return (
		<Section title='Featured products'>
			{isLoading ? (
				<FeaturedProductsSkeleton />
			) : products.length ? (
				<div className='flex gap-4 -mx-4 px-4 overflow-x-auto'>
					{products.map(product => (
						<Product
							key={product.id}
							id={product.id}
							name={product.name}
							unitPrice={product.unitPrice}
							imagePath={product.images[0]?.path}
						/>
					))}
				</div>
			) : (
				<EmptyState message='No product highlights yet. Try searching for something specific.' />
			)}
		</Section>
	);
};

const FeaturedProductsSkeleton = () => (
	<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
		{Array.from({ length: 3 }).map((_, index) => (
			<div key={index} className='rounded-2xl border overflow-hidden'>
				<Skeleton className='aspect-square w-full' />
				<div className='p-4 space-y-2'>
					<Skeleton className='h-4 w-2/3' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-5 w-1/4' />
				</div>
			</div>
		))}
	</div>
);

interface RecentlyViewedSectionProps {
	products: RecentlyViewedProduct[];
}

const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
	products
}) => {
	return (
		<Section title='Recently viewed'>
			{products.length ? (
				<div className='flex gap-4 -mx-4 px-4 overflow-x-auto'>
					{products.map(product => (
						<Product
							key={product.id}
							id={product.id}
							name={product.name}
							unitPrice={product.unitPrice}
							imagePath={product.image ?? undefined}
						/>
					))}
				</div>
			) : (
				<EmptyState message='You have not viewed any products yet. Explore featured picks to get started.' />
			)}
		</Section>
	);
};

const EmptyState = ({ message }: { message: string }) => (
	<div className='rounded-2xl border border-dashed p-10 text-center text-muted-foreground'>
		{message}
	</div>
);

export default HomePage;
