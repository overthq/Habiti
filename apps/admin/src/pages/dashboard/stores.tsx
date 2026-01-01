import { type Store } from '@/data/types';
import { type ColumnDef } from '@tanstack/react-table';
import { useStoresQuery } from '@/data/queries';
import { DataTable } from '@/components/ui/data-table';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import CreateStoreDialog from '@/components/stores/create-store-dialog';

const columns: ColumnDef<Store>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/stores/${row.original.id}`}>{row.original.name}</Link>
			</Button>
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
				<h1 className='text-3xl font-semibold'>Stores</h1>
				<CreateStoreDialog />
			</div>
			<DataTable columns={columns} data={data.stores} />
		</div>
	);
};

export default Stores;
