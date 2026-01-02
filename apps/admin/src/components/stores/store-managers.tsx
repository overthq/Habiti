import { type ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';

import { DataTable } from '../ui/data-table';
import { useStoreManagersQuery } from '@/data/queries';

import { type StoreManager } from '@/data/types';
import { Button } from '../ui/button';

const columns: ColumnDef<StoreManager>[] = [
	{
		header: 'Name',
		accessorKey: 'manager.name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/users/${row.original.manager.id}`}>
					{row.original.manager.name}
				</Link>
			</Button>
		)
	},
	{
		header: 'Email',
		accessorKey: 'manager.email'
	}
];

const StoreManagers = ({ storeId }: { storeId: string }) => {
	const { data } = useStoreManagersQuery(storeId);

	if (!data) return null;

	return (
		<div>
			<DataTable
				columns={columns}
				data={data.managers}
				hasColumnDropdown={false}
			/>
		</div>
	);
};

export default StoreManagers;
