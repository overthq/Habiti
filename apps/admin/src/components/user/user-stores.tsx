import { type ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';

import { useUserStoresQuery } from '@/data/queries';
import { type StoreManager, type User } from '@/data/types';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import StatusPill from '../status-pill';

interface UserStoresProps {
	user: User;
}

const columns: ColumnDef<StoreManager>[] = [
	{
		header: 'Name',
		accessorKey: 'store.name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to='/stores/$id' params={{ id: row.original.store.id }}>
					{row.original.store.name}
				</Link>
			</Button>
		)
	},
	{
		header: 'Status',
		accessorKey: 'store.unlisted',
		cell: ({ row }) => (
			<StatusPill
				tone={row.original.store.unlisted ? 'gray' : 'green'}
				label={row.original.store.unlisted ? 'Unlisted' : 'Listed'}
			/>
		)
	},
	{
		header: 'Manager Since',
		accessorKey: 'createdAt',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	},
	{
		header: 'Created At',
		accessorKey: 'store.createdAt',
		cell: ({ row }) =>
			new Date(row.original.store.createdAt).toLocaleDateString()
	}
];

const UserStores = ({ user }: UserStoresProps) => {
	const { data, isLoading } = useUserStoresQuery(user.id);

	if (isLoading) return <div>Loading...</div>;

	if (!data) return <div>No stores found</div>;

	return (
		<div>
			<DataTable data={data.stores} columns={columns} />
		</div>
	);
};

export default UserStores;
