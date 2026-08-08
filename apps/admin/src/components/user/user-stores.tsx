import { type ColumnDef } from '@tanstack/react-table';
import { Link } from '@tanstack/react-router';

import { useUserStoresQuery } from '@/data/queries';
import { type Store, type User } from '@/data/types';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import StatusPill from '../status-pill';

interface UserStoresProps {
	user: User;
}

const columns: ColumnDef<Store>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to='/stores/$id' params={{ id: row.original.id }}>
					{row.original.name}
				</Link>
			</Button>
		)
	},
	{
		header: 'Status',
		accessorKey: 'unlisted',
		cell: ({ row }) => (
			<StatusPill
				tone={row.original.unlisted ? 'gray' : 'green'}
				label={row.original.unlisted ? 'Unlisted' : 'Listed'}
			/>
		)
	},
	{
		header: 'Created At',
		accessorKey: 'createdAt',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
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
