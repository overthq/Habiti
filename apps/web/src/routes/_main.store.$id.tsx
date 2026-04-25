import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { StoreHeader, StoreProducts } from '@/components/store';
import { useStoreQuery } from '@/data/queries';
import { getStore } from '@/data/requests';

export const Route = createFileRoute('/_main/store/$id')({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData({
			queryKey: ['stores', params.id],
			queryFn: () => getStore(params.id)
		}),
	component: StorePage
});

function StorePage() {
	return (
		<Suspense fallback={<div />}>
			<StorePageContent />
		</Suspense>
	);
}

const StorePageContent = () => {
	const { id } = Route.useParams();
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
