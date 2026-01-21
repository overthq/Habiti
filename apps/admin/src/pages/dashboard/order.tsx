import { ChevronDown, RefreshCw } from 'lucide-react';
import { useParams } from 'react-router';

import CopyableText from '@/components/ui/copy';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/confirm-dialog';
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
	const { mutateAsync: updateOrder, isPending } = useUpdateOrderMutation(
		id as string
	);

	if (isLoading || !id) {
		return <div>Loading...</div>;
	}

	const order = orderData?.order;

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-semibold'>
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline'>
							Actions
							<ChevronDown className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<RefreshCw className='mr-2 h-4 w-4' />
								Update status
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{Object.values(OrderStatus).map(statusOption => (
									<ConfirmDialog
										key={statusOption}
										title='Update Order Status'
										description={`Change order status from "${order?.status}" to "${statusOption}"?`}
										confirmLabel='Update'
										variant='default'
										isLoading={isPending}
										onConfirm={() => updateOrder({ status: statusOption })}
										trigger={
											<DropdownMenuCheckboxItem
												onSelect={e => e.preventDefault()}
												checked={statusOption === order?.status}
											>
												{statusOption}
											</DropdownMenuCheckboxItem>
										}
									/>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<InlineMeta
				items={[
					<span key='serial' className='font-mono text-sm'>
						Serial #{order?.serialNumber}
					</span>,
					<span key='customer'>
						Customer:{' '}
						<Link
							to={`/users/${order?.userId}`}
							className='underline-offset-4 hover:underline'
						>
							{order?.user.name}
						</Link>
					</span>,
					<span key='store'>
						Store:{' '}
						<Link
							to={`/stores/${order?.storeId}`}
							className='underline-offset-4 hover:underline'
						>
							{order?.store.name}
						</Link>
					</span>,
					<span key='date' className='font-mono text-sm'>
						Placed{' '}
						{order?.createdAt
							? new Date(order.createdAt).toLocaleString()
							: '—'}
					</span>
				]}
			/>

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
