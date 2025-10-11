'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import Product from '@/components/store/Product';
import { useStoreQuery } from '@/data/queries';

const StorePage = () => {
	const { id } = useParams<{ id: string }>();
	const { data, isLoading } = useStoreQuery(id);

	if (isLoading || !data) return <div />;

	return (
		<div className='mx-auto'>
			<h1 className='text-3xl font-medium'>{data.store.name}</h1>
			<p className='text-muted-foreground'>{data.store.description}</p>
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
