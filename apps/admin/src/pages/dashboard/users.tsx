import { DataTable } from '@/components/ui/data-table';
import { useUsersQuery } from '@/data/queries';
import { User } from '@/data/types';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
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
		<div>
			<DataTable columns={columns} data={data.users} />
		</div>
	);
};

export default Users;
