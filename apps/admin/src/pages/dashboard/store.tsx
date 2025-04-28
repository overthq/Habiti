import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateStoreMutation } from '@/data/mutations';
import { useStoreQuery } from '@/data/queries';
import { UpdateStoreBody } from '@/data/types';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Store as StoreType } from '@/data/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StoreManagers from '@/components/stores/store-managers';
import StoreProducts from '@/components/stores/store-products';
import StoreOrders from '@/components/stores/store-orders';
import StorePayouts from '@/components/stores/store-payouts';

interface StoreMainProps {
	store: StoreType;
}

const StoreMain = ({ store }: StoreMainProps) => {
	const updateStoreMutation = useUpdateStoreMutation(store.id);

	const form = useForm<UpdateStoreBody>({
		defaultValues: {
			name: store.name,
			description: store.description
		}
	});

	const onSubmit = async (data: UpdateStoreBody) => {
		await updateStoreMutation.mutateAsync(data);
	};

	return (
		<Form {...form}>
			<div className='space-y-6'>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-bold'>{store.name}</h1>
					<Button
						onClick={form.handleSubmit(onSubmit)}
						disabled={!form.formState.isDirty}
					>
						Save Changes
					</Button>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Store Details</CardTitle>
						</CardHeader>
						<CardContent>
							<form
								className='space-y-4'
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input id='name' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea id='description' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Store Information</CardTitle>
						</CardHeader>
						<CardContent>
							<dl className='space-y-4'>
								<div>
									<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
										Created
									</dt>
									<dd className='mt-1'>
										{new Date(store.createdAt).toLocaleDateString()}
									</dd>
								</div>
								<div>
									<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
										Last Updated
									</dt>
									<dd className='mt-1'>
										{new Date(store.updatedAt).toLocaleDateString()}
									</dd>
								</div>
								{store.image && (
									<div>
										<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
											Store Image
										</dt>
										<dd className='mt-1'>
											<img
												src={store.image.path}
												alt={store.name}
												className='rounded-md w-full max-w-xs'
											/>
										</dd>
									</div>
								)}
							</dl>
						</CardContent>
					</Card>
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
		</Form>
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
