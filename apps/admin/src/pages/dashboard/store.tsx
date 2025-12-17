import { useParams } from 'react-router';

import { useStoreQuery } from '@/data/queries';
import { type Store as StoreType } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import CopyableText from '@/components/ui/copy';
import InlineMeta from '@/components/ui/inline-meta';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StoreManagers from '@/components/stores/store-managers';
import StoreProducts from '@/components/stores/store-products';
import StoreOrders from '@/components/stores/store-orders';
import StorePayouts from '@/components/stores/store-payouts';
import UpdateStoreDialog from '@/components/store/update-store-dialog';

interface StoreMainProps {
	store: StoreType;
}

const StoreMain = ({ store }: StoreMainProps) => {
	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-semibold'>{store.name}</h1>
					<InlineMeta
						items={[
							<span key='status'>
								<Badge variant={store.unlisted ? 'secondary' : 'default'}>
									{store.unlisted ? 'Unlisted' : 'Listed'}
								</Badge>
							</span>,
							<span key='id'>
								<CopyableText value={store.id} />
							</span>,
							<span key='created' className='font-mono text-sm'>
								Created {new Date(store.createdAt).toLocaleString()}
							</span>,
							<span key='updated' className='font-mono text-sm'>
								Updated {new Date(store.updatedAt).toLocaleString()}
							</span>
						]}
					/>
				</div>
				<UpdateStoreDialog store={store} />
			</div>

			<div>
				<p>Description</p>
				<p className='text-muted-foreground whitespace-pre-wrap'>
					{store.description || '—'}
				</p>
			</div>

			<Tabs defaultValue='products'>
				<TabsList>
					<TabsTrigger value='products'>Products</TabsTrigger>
					<TabsTrigger value='orders'>Orders</TabsTrigger>
					<TabsTrigger value='payouts'>Payouts</TabsTrigger>
					<TabsTrigger value='managers'>Managers</TabsTrigger>
				</TabsList>
				<TabsContent value='products'>
					<StoreProducts storeId={store.id} />
				</TabsContent>
				<TabsContent value='orders'>
					<StoreOrders storeId={store.id} />
				</TabsContent>
				<TabsContent value='payouts'>
					<StorePayouts storeId={store.id} />
				</TabsContent>
				<TabsContent value='managers'>
					<StoreManagers storeId={store.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

const Store = () => {
	const { id } = useParams();
	const { data: storeData, isLoading } = useStoreQuery(id as string);

	if (isLoading || !id) {
		return <div>Loading...</div>;
	}

	const store = storeData?.store;

	if (!store) {
		return <div>Store not found</div>;
	}

	return <StoreMain store={store} />;
};

export default Store;
