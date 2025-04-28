import { Store } from '@/data/types';
import { ColumnDef } from '@tanstack/react-table';
import { useStoresQuery } from '@/data/queries';
import { DataTable } from '@/components/ui/data-table';
import { Link } from 'react-router';

const columns: ColumnDef<Store>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<Link to={`/stores/${row.original.id}`}>{row.original.name}</Link>
		)
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
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-3xl font-bold'>Stores</h1>
			</div>
			<DataTable columns={columns} data={data.stores} />
		</div>
	);
};

export default Stores;
