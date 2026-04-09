import { useUserSessionsQuery } from '@/data/queries';
import { type Session, type User } from '@/data/types';
import { DataTable } from '../ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';

interface UserSessionsProps {
	user: User;
}

const columns: ColumnDef<Session>[] = [
	{
		header: 'IP Address',
		accessorKey: 'ipAddress',
		cell: ({ row }) => (
			<span className='font-mono text-sm'>
				{row.original.ipAddress ?? 'Unknown'}
			</span>
		)
	},
	{
		header: 'User Agent',
		accessorKey: 'userAgent',
		cell: ({ row }) => (
			<span className='max-w-xs truncate text-sm'>
				{row.original.userAgent ?? 'Unknown'}
			</span>
		)
	},
	{
		header: 'Status',
		accessorKey: 'revoked',
		cell: ({ row }) => (
			<Badge variant={row.original.revoked ? 'secondary' : 'default'}>
				{row.original.revoked ? 'Revoked' : 'Active'}
			</Badge>
		)
	},
	{
		header: 'Last Active',
		accessorKey: 'lastActiveAt',
		cell: ({ row }) => new Date(row.original.lastActiveAt).toLocaleDateString()
	},
	{
		header: 'Created At',
		accessorKey: 'createdAt',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

const UserSessions = ({ user }: UserSessionsProps) => {
	const { data, isLoading } = useUserSessionsQuery(user.id);

	if (isLoading) return <div>Loading...</div>;

	if (!data) return <div>No sessions found</div>;

	return (
		<div>
			<DataTable data={data.sessions} columns={columns} />
		</div>
	);
};

export default UserSessions;
