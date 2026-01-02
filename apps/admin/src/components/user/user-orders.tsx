import { useOrdersQuery } from '@/data/queries';
import { type Order, type User } from '@/data/types';
import { DataTable } from '../ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import { formatNaira } from '@/utils/format';
import OrderStatusPill from '../order-status-pill';

interface UserOrdersProps {
	user: User;
}

const columns: ColumnDef<Order>[] = [
	{
		header: 'Serial Number',
		accessorKey: 'serialNumber'
	},
	{
		header: 'Store',
		accessorKey: 'store.name'
	},
	{
		header: 'Total',
		accessorKey: 'total',
		cell: ({ row }) => {
			return <div>{formatNaira(row.original.total)}</div>;
		}
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
	},
	{
		header: 'Updated At',
		accessorKey: 'updatedAt',
		cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString()
	}
];

const UserOrders = ({ user }: UserOrdersProps) => {
	const { data, isLoading } = useOrdersQuery({
		userId: user.id
	});

	if (isLoading) return <div>Loading...</div>;

	if (!data) return <div>No orders found</div>;

	return (
		<div>
			<DataTable data={data.orders} columns={columns} />
		</div>
	);
};

export default UserOrders;
