'use client';

import React from 'react';
import Product from './Product';
import { useStoreProductsQuery } from '@/data/queries';
import { StoreProductCategory } from '@/data/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useStoreFilters } from '@/hooks/use-store-filters';
import StoreProductFilters from './StoreProductFilters';
import StoreCategories from './StoreCategories';

interface StoreProductsProps {
	storeId: string;
	categories: StoreProductCategory[];
}

const StoreProducts: React.FC<StoreProductsProps> = ({
	storeId,
	categories
}) => {
	const {
		sortBy,
		categoryId,
		inStock,
		setSortBy,
		setCategoryId,
		setInStock,
		queryParams
	} = useStoreFilters();

	const { data, isLoading } = useStoreProductsQuery(storeId, queryParams);

	return (
		<div className='mt-4 space-y-5'>
			<h2 className='text-lg font-medium'>Products</h2>

			<StoreCategories
				categories={categories}
				selectedCategory={categoryId}
				onCategoryChange={setCategoryId}
			/>

			<StoreProductFilters
				sortBy={sortBy}
				onSortChange={setSortBy}
				inStock={inStock}
				onInStockChange={setInStock}
			/>

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

			{!isLoading && !data?.products.length && (
				<div className='text-center text-lg font-medium text-muted-foreground'>
					No products
				</div>
			)}
		</div>
	);
};

export default StoreProducts;
