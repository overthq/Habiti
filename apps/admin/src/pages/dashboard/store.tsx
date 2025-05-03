import { useParams } from 'react-router';

import { useStoreQuery } from '@/data/queries';
import { type Store as StoreType } from '@/data/types';
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
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>{store.name}</h1>
				<UpdateStoreDialog store={store} />
			</div>

			<div>
				<p>{store.description}</p>
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
