import { DataTable } from '../ui/data-table';
import { useStorePayoutsQuery } from '@/data/queries';
import { type ColumnDef } from '@tanstack/react-table';
import { type Payout } from '@/data/types';
import { formatNaira } from '@/utils/format';

const columns: ColumnDef<Payout>[] = [
	{
		header: 'Amount',
		accessorKey: 'amount',
		cell: ({ row }) => `${formatNaira(row.original.amount)}`
	},
	{
		header: 'Status',
		accessorKey: 'status'
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

const StorePayouts = ({ storeId }: { storeId: string }) => {
	const { data } = useStorePayoutsQuery(storeId);

	if (!data) return null;

	return (
		<div>
			<DataTable
				columns={columns}
				data={data.payouts}
				hasColumnDropdown={false}
			/>
		</div>
	);
};

export default StorePayouts;
