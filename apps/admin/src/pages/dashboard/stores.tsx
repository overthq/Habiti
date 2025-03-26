import { Store } from '@/data/types';
import { ColumnDef } from '@tanstack/react-table';
import { useStoresQuery } from '@/data/queries';
import { DataTable } from '@/components/ui/data-table';

const columns: ColumnDef<Store>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

const Stores = () => {
	const { data, isLoading } = useStoresQuery();

	if (isLoading) return <div />;

	if (!data) return <div>No data</div>;

	return (
		<div>
			<DataTable columns={columns} data={data.stores} />
		</div>
	);
};

export default Stores;
