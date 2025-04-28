import { DataTable } from '../ui/data-table';
import { useStoreOrdersQuery } from '@/data/queries';
import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/data/types';
import { formatNaira } from '@/utils/format';

const columns: ColumnDef<Order>[] = [
	{
		id: 'name',
		header: 'Customer',
		cell: ({ row }) => row.original.user.name
	},
	{
		header: 'Total',
		accessorKey: 'total',
		cell: ({ row }) => `${formatNaira(row.original.total)}`
	},
	{
		header: 'Status',
		accessorKey: 'status'
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
