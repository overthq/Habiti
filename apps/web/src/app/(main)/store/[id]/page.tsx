'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';

import { StoreHeader, StoreProducts } from '@/components/store';
import { useStoreQuery } from '@/data/queries';

const StorePageContent = () => {
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

const StorePage = () => {
	return (
		<Suspense fallback={<div />}>
			<StorePageContent />
		</Suspense>
	);
};

export const runtime = 'edge';

export default StorePage;
