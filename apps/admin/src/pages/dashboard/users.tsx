import { useState } from 'react';
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useUsersQuery } from '@/data/queries';
import {
	useBulkSuspendUsersMutation,
	useBulkUnsuspendUsersMutation,
	useBulkDeleteUsersMutation
} from '@/data/mutations';
import { type User } from '@/data/types';

const columns: ColumnDef<User>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableSorting: false,
		enableHiding: false
	},
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
		accessorKey: 'suspended',
		header: 'Status',
		cell: ({ row }) => (
			<span
				className={
					row.original.suspended ? 'text-destructive' : 'text-green-600'
				}
			>
				{row.original.suspended ? 'Suspended' : 'Active'}
			</span>
		)
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

const Users = () => {
	const { data, isLoading } = useUsersQuery();
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const bulkSuspendMutation = useBulkSuspendUsersMutation();
	const bulkUnsuspendMutation = useBulkUnsuspendUsersMutation();
	const bulkDeleteMutation = useBulkDeleteUsersMutation();

	const selectedIds = Object.keys(rowSelection);
	const selectedCount = selectedIds.length;

	const clearSelection = () => setRowSelection({});

	const handleBulkSuspend = () => {
		bulkSuspendMutation.mutate(selectedIds, {
			onSuccess: () => clearSelection()
		});
	};

	const handleBulkUnsuspend = () => {
		bulkUnsuspendMutation.mutate(selectedIds, {
			onSuccess: () => clearSelection()
		});
	};

	const handleBulkDelete = () => {
		bulkDeleteMutation.mutate(selectedIds, {
			onSuccess: () => clearSelection()
		});
	};

	if (isLoading) return <div />;

	if (!data) return <div>No data</div>;

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-semibold'>Users</h1>
			</div>

			<BulkActionsToolbar
				selectedCount={selectedCount}
				onClearSelection={clearSelection}
			>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkSuspend}
					disabled={bulkSuspendMutation.isPending}
				>
					Suspend
				</Button>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkUnsuspend}
					disabled={bulkUnsuspendMutation.isPending}
				>
					Unsuspend
				</Button>
				<ConfirmDialog
					title='Delete Users'
					description={`Are you sure you want to delete ${selectedCount} user(s)? This action cannot be undone.`}
					confirmLabel='Delete'
					variant='destructive'
					isLoading={bulkDeleteMutation.isPending}
					onConfirm={handleBulkDelete}
					trigger={
						<Button size='sm' variant='destructive'>
							Delete
						</Button>
					}
				/>
			</BulkActionsToolbar>

			<DataTable
				columns={columns}
				data={data.users}
				rowSelection={rowSelection}
				onRowSelectionChange={setRowSelection}
				getRowId={row => row.id}
			/>
		</div>
	);
};

export default Users;
