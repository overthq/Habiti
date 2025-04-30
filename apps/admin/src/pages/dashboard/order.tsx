import React from 'react';
import { Check } from 'lucide-react';
import { useParams } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useUpdateOrderMutation } from '@/data/mutations';
import { useOrderQuery } from '@/data/queries';
import { OrderStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';

const statusVariants = {
	[OrderStatus.Pending]: 'secondary',
	[OrderStatus.Processing]: 'default',
	[OrderStatus.Completed]: 'default',
	[OrderStatus.Cancelled]: 'destructive',
	[OrderStatus.Delivered]: 'default'
} as const;

const OrderDetailPage = () => {
	const { id } = useParams();
	const { data: orderData, isLoading } = useOrderQuery(id as string);
	const { mutateAsync: updateOrder } = useUpdateOrderMutation(id as string);
	const [status, setStatus] = React.useState<OrderStatus>();

	if (isLoading || !id) {
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
				<h1 className='text-3xl font-bold'>
					{order?.store.name} Order #{order?.serialNumber}
				</h1>
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

			<div>
				<p className='text-lg font-bold'>Order Details</p>
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
						<dd className='mt-1'>{formatNaira(order?.total || 0)}</dd>
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
			</div>

			<div>
				<p className='text-lg font-bold'>Products</p>
				<div className='rounded-md border'>
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
								<TableRow key={item.product.id}>
									<TableCell>{item.product.name}</TableCell>
									<TableCell>{item.quantity}</TableCell>
									<TableCell>{formatNaira(item.unitPrice)}</TableCell>
									<TableCell>
										{formatNaira(item.quantity * item.unitPrice)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default OrderDetailPage;
