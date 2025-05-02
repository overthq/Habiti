import { useOrdersQuery } from '@/data/queries';
import { type Order, type User } from '@/data/types';
import { DataTable } from '../ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import { formatNaira } from '@/utils/format';

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
		accessorKey: 'status'
	},
	{
		header: 'Created At',
		accessorKey: 'createdAt'
	},
	{
		header: 'Updated At',
		accessorKey: 'updatedAt'
	}
];

const UserOrders = ({ user }: UserOrdersProps) => {
	const { data, isLoading } = useOrdersQuery({
		filter: {
			userId: user.id
		}
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
