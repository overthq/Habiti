import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { StoreHeader, StoreProducts } from '@/components/store';
import { useStoreQuery } from '@/data/queries';
import { getStore } from '@/data/requests';
import { smartAppBannerMeta } from '@/utils/smart-app-banner';

export const Route = createFileRoute('/_main/store/$id')({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData({
			queryKey: ['stores', params.id],
			queryFn: () => getStore(params.id)
		}),
	head: ({ params, loaderData }) => {
		const banner = smartAppBannerMeta(`/store/${params.id}`);
		const store = loaderData?.store;

		if (!store) return { meta: banner ? [banner] : [] };

		const title = `${store.name} | Habiti`;
		const description = store.description ?? `Shop ${store.name} on Habiti.`;
		const image = store.image?.path;

		return {
			meta: [
				...(banner ? [banner] : []),
				{ title },
				{ name: 'description', content: description },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: title },
				{ property: 'og:description', content: description },
				...(image ? [{ property: 'og:image', content: image }] : []),
				{
					name: 'twitter:card',
					content: image ? 'summary_large_image' : 'summary'
				},
				{ name: 'twitter:title', content: title },
				{ name: 'twitter:description', content: description },
				...(image ? [{ name: 'twitter:image', content: image }] : [])
			]
		};
	},
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
