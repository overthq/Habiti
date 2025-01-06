'use client';

import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useOrdersQuery } from '@/data/queries/orders';

const statusVariants = {
	Pending: 'secondary',
	Processing: 'default',
	Completed: 'success',
	Cancelled: 'destructive',
	Delivered: 'success'
} as const;

export default function OrdersPage() {
	const { data: orders, isLoading } = useOrdersQuery();
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Orders</h1>
			</div>

			<div className='bg-white dark:bg-gray-900 shadow rounded-lg'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Order ID</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Store</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Total</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={7} className='text-center'>
									Loading...
								</TableCell>
							</TableRow>
						) : (
							orders?.map(order => (
								<TableRow key={order.id}>
									<TableCell>{order.id}</TableCell>
									<TableCell>{order.user.name}</TableCell>
									<TableCell>{order.store.name}</TableCell>
									<TableCell>
										<Badge
											variant={
												statusVariants[
													order.status as keyof typeof statusVariants
												]
											}
										>
											{order.status}
										</Badge>
									</TableCell>
									<TableCell>${order.total.toFixed(2)}</TableCell>
									<TableCell>
										{new Date(order.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<div className='flex gap-2'>
											<Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
												<Eye className='h-4 w-4' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
