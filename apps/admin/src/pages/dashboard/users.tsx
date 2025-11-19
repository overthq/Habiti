import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useUsersQuery } from '@/data/queries';
import { type User } from '@/data/types';
import { type ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';

const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/users/${row.original.id}`}>{row.original.name}</Link>
			</Button>
		)
	},
	{
		accessorKey: 'email',
		header: 'Email'
	},
	{
		accessorKey: 'role',
		header: 'Role'
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

const Users = () => {
	const { data, isLoading } = useUsersQuery();

	if (isLoading) return <div />;

	if (!data) return <div>No data</div>;

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-semibold'>Users</h1>
			</div>

			<DataTable columns={columns} data={data.users} />
		</div>
	);
};

export default Users;
