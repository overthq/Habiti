'use client';

import React from 'react';
import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useUpdateOrderMutation } from '@/data/mutations/orders';
import { useOrderQuery } from '@/data/queries/orders';
import { OrderStatus } from '@/data/services/orders';

const statusVariants = {
	[OrderStatus.Pending]: 'secondary',
	[OrderStatus.Processing]: 'default',
	[OrderStatus.Completed]: 'success',
	[OrderStatus.Cancelled]: 'destructive',
	[OrderStatus.Delivered]: 'success'
} as const;

export default function OrderDetailPage({
	params
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);
	const { data: orderData, isLoading } = useOrderQuery(id);
	const { mutateAsync: updateOrder } = useUpdateOrderMutation(id);
	const [status, setStatus] = React.useState<OrderStatus>();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const order = orderData?.order;

	const handleStatusUpdate = async () => {
		if (!status) return;
		await updateOrder({ status });
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Order #{order?.id}</h1>
				<div className='flex items-center gap-4'>
					<Badge
						variant={
							statusVariants[order?.status as keyof typeof statusVariants]
						}
					>
						{order?.status}
					</Badge>
					<div className='flex items-center gap-2'>
						<Select
							value={status}
							onValueChange={value => setStatus(value as OrderStatus)}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Update status' />
							</SelectTrigger>
							<SelectContent>
								{Object.values(OrderStatus).map(status => (
									<SelectItem key={status} value={status}>
										{status}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button size='sm' onClick={handleStatusUpdate} disabled={!status}>
							<Check className='h-4 w-4 mr-2' />
							Update
						</Button>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<Card>
					<CardHeader>
						<CardTitle>Order Details</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className='space-y-4'>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Customer
								</dt>
								<dd className='mt-1'>{order?.user.name}</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Store
								</dt>
								<dd className='mt-1'>{order?.store.name}</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Total
								</dt>
								<dd className='mt-1'>${order?.total.toFixed(2)}</dd>
							</div>
							<div>
								<dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
									Date
								</dt>
								<dd className='mt-1'>
									{new Date(order?.createdAt || '').toLocaleDateString()}
								</dd>
							</div>
						</dl>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Products</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Unit Price</TableHead>
									<TableHead>Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{order?.products.map(item => (
									<TableRow key={item.id}>
										<TableCell>{item.product.name}</TableCell>
										<TableCell>{item.quantity}</TableCell>
										<TableCell>${item.unitPrice.toFixed(2)}</TableCell>
										<TableCell>
											${(item.quantity * item.unitPrice).toFixed(2)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
