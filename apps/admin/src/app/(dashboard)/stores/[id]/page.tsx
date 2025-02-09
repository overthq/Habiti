'use client';

import React from 'react';
import { Edit, Package } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import {
	useStoreProductsQuery,
	useStoreQuery,
	useStorePayoutsQuery,
	useStoreManagersQuery
} from '@/data/queries/stores';
import { formatNaira } from '@/utils/format';

const StoreDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = React.use(params);
	const { data: storeData, isLoading: isLoadingStore } = useStoreQuery(id);
	const { data: productsData, isLoading: isLoadingProducts } =
		useStoreProductsQuery(id);
	const { data: payoutsData, isLoading: isLoadingPayouts } =
		useStorePayoutsQuery(id);
	const { data: managersData, isLoading: isLoadingManagers } =
		useStoreManagersQuery(id);

	if (isLoadingStore || isLoadingProducts) {
		return <div>Loading...</div>;
	}

	const store = storeData?.store;
	const products = productsData?.products || [];
	const managers = managersData?.managers || [];
	const payouts = payoutsData?.payouts || [];

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>{store?.name}</h1>
				<Button variant='outline' size='sm'>
					<Edit className='h-4 w-4 mr-2' />
					Edit Store
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Store Details</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className='space-y-4'>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Description
								</dt>
								<dd className='mt-1'>{store?.description}</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Created At
								</dt>
								<dd className='mt-1'>
									{new Date(store?.createdAt || '').toLocaleDateString()}
								</dd>
							</div>
						</dl>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='flex flex-row items-center justify-between'>
						<CardTitle>Products</CardTitle>
						<Button variant='outline' size='sm' asChild>
							<Link href={`/stores/${id}/products/new`}>
								<Package className='h-4 w-4 mr-2' />
								Add Product
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Stock</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map(product => (
										<TableRow key={product.id}>
											<TableCell>{product.name}</TableCell>
											<TableCell>{formatNaira(product.unitPrice)}</TableCell>
											<TableCell>{product.quantity}</TableCell>
											<TableCell>
												<Button
													variant='ghost'
													size='sm'
													className='h-8 w-8 p-0'
													asChild
												>
													<Link href={`/dashboard/products/${product.id}`}>
														<Edit className='h-4 w-4' />
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Managers</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{managers.map(({ manager }) => (
										<TableRow key={manager.id}>
											<TableCell>{manager.name}</TableCell>
											<TableCell>{manager.email}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Payouts</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{payoutsData?.payouts.map(payout => (
										<TableRow key={payout.id}>
											<TableCell>{formatNaira(payout.amount)}</TableCell>
											<TableCell>{payout.status}</TableCell>
											<TableCell>
												{new Date(payout.createdAt).toLocaleDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default StoreDetailPage;
