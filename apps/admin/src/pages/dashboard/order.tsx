import React from 'react';
import { Check } from 'lucide-react';
import { useParams } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CopyableText from '@/components/ui/copy';
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
import { Link } from 'react-router';
import { OrderStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';
import OrderStatusPill from '@/components/order-status-pill';
import InlineMeta from '@/components/ui/inline-meta';

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
			<div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-3xl font-semibold tracking-tight'>
						{order?.store.name} Order #{order?.serialNumber}
					</h1>
					<InlineMeta
						items={[
							order?.status ? (
								<OrderStatusPill key='status' status={order.status} />
							) : null,
							<span key='total' className='font-medium'>
								{formatNaira(order?.total || 0)}
							</span>,
							<span key='orderid'>
								<CopyableText value={order?.id || ''} />
							</span>
						]}
					/>
				</div>
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

			<Card>
				<CardHeader>
					<CardTitle>Order Details</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<p className='text-muted-foreground text-sm'>Order ID</p>
							<CopyableText value={order?.id || ''} />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Serial</p>
							<p className='font-mono text-sm'>#{order?.serialNumber}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Customer</p>
							<p className='font-medium'>
								<Link
									to={`/users/${order?.userId}`}
									className='underline-offset-4 hover:underline'
								>
									{order?.user.name}
								</Link>
							</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Customer ID</p>
							<CopyableText value={order?.userId || ''} />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Store</p>
							<p className='font-medium'>
								<Link
									to={`/stores/${order?.storeId}`}
									className='underline-offset-4 hover:underline'
								>
									{order?.store.name}
								</Link>
							</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Store ID</p>
							<CopyableText value={order?.storeId || ''} />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Total</p>
							<p className='font-semibold'>{formatNaira(order?.total || 0)}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Date</p>
							<p className='font-mono text-sm'>
								{order?.createdAt
									? new Date(order.createdAt).toLocaleString()
									: '—'}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

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
	);
};

export default OrderDetailPage;
