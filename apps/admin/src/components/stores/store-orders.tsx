import { DataTable } from '../ui/data-table';
import { useStoreOrdersQuery } from '@/data/queries';
import { type ColumnDef } from '@tanstack/react-table';
import { type Order } from '@/data/types';
import { formatNaira } from '@/utils/format';
import OrderStatusPill from '../order-status-pill';
import { Button } from '../ui/button';
import { Link } from 'react-router';

const columns: ColumnDef<Order>[] = [
	{
		id: 'name',
		header: 'Customer',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/users/${row.original.user.id}`}>
					{row.original.user.name}
				</Link>
			</Button>
		)
	},
	{
		header: 'Total',
		accessorKey: 'total',
		cell: ({ row }) => `${formatNaira(row.original.total)}`
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => <OrderStatusPill status={row.original.status} />
	},
	{
		header: 'Created At',
		accessorKey: 'createdAt',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

const StoreOrders = ({ storeId }: { storeId: string }) => {
	const { data } = useStoreOrdersQuery(storeId);

	if (!data) return null;

	return (
		<div>
			<DataTable
				columns={columns}
				data={data.orders}
				hasColumnDropdown={false}
			/>
		</div>
	);
};

export default StoreOrders;
