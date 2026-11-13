import { useState, useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
	type ColumnDef,
	type RowSelectionState,
	type SortingState
} from '@tanstack/react-table';
import { ListFilter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { ConfirmDialog } from '@/components/confirm-dialog';
import StatusPill from '@/components/status-pill';
import { useUsersQuery } from '@/data/queries';
import {
	useBulkUpdateUsersMutation,
	useBulkDeleteUsersMutation
} from '@/data/mutations';
import { type User, type UserFilters } from '@/data/types';
import { useTableFilters } from '@/hooks/use-table-filters';

export const Route = createFileRoute('/_dashboard/users/')({
	component: Users
});

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
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		),
		cell: ({ row }) => (
			<div className='flex items-center gap-2'>
				<Button variant='link' asChild className='px-0 w-fit'>
					<Link to='/users/$id' params={{ id: row.original.id }}>
						{row.original.name}
					</Link>
				</Button>
				{row.original.isAnonymous && <StatusPill tone='gray' label='Guest' />}
			</div>
		)
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => row.original.email ?? '—'
	},
	{
		accessorKey: 'suspended',
		header: 'Status',
		cell: ({ row }) => (
			<StatusPill
				tone={row.original.suspended ? 'red' : 'green'}
				label={row.original.suspended ? 'Suspended' : 'Active'}
			/>
		),
		enableSorting: false
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Created At' />
		),
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

// Guests are hidden unless the URL opts in: no `accountType` means registered only.
type UsersPageFilters = Omit<UserFilters, 'isAnonymous'> & {
	accountType?: 'guest' | 'all';
};

const defaultFilters: UsersPageFilters = {
	search: undefined,
	suspended: undefined,
	accountType: undefined,
	orderBy: undefined
};

function Users() {
	const { filters, setFilter, clearFilters, hasActiveFilters } =
		useTableFilters({ defaults: defaultFilters });

	const { accountType, ...queryFilters } = filters;
	const showRegistered = accountType !== 'guest';
	const showGuests = accountType !== undefined;

	const { data, isLoading } = useUsersQuery({
		...queryFilters,
		isAnonymous: accountType === 'all' ? undefined : accountType === 'guest'
	});

	const setAccountTypes = (registered: boolean, guests: boolean) => {
		if (!registered && !guests) return;
		setFilter(
			'accountType',
			registered && guests ? 'all' : guests ? 'guest' : undefined
		);
	};
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const bulkUpdateMutation = useBulkUpdateUsersMutation();
	const bulkDeleteMutation = useBulkDeleteUsersMutation();

	const selectedIds = Object.keys(rowSelection);
	const selectedCount = selectedIds.length;

	const clearSelection = () => setRowSelection({});

	const handleBulkSuspend = () => {
		bulkUpdateMutation.mutate(
			{ ids: selectedIds, field: 'suspended', value: true },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkUnsuspend = () => {
		bulkUpdateMutation.mutate(
			{ ids: selectedIds, field: 'suspended', value: false },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkDelete = () => {
		bulkDeleteMutation.mutate(selectedIds, {
			onSuccess: () => clearSelection()
		});
	};

	const sorting = useMemo<SortingState>(() => {
		if (!filters.orderBy) return [];
		const field = Object.keys(filters.orderBy)[0];
		const direction = Object.values(filters.orderBy)[0] as 'asc' | 'desc';
		return [{ id: field, desc: direction === 'desc' }];
	}, [filters.orderBy]);

	const handleSortingChange = (newSorting: SortingState) => {
		if (newSorting.length === 0) {
			setFilter('orderBy', undefined);
		} else {
			const sort = newSorting[0];
			setFilter('orderBy', { [sort.id]: sort.desc ? 'desc' : 'asc' });
		}
	};

	if (isLoading) return <div />;

	if (!data) return <div>No data</div>;

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-semibold'>Users</h1>
			</div>

			<BulkActionsToolbar
				selectedCount={selectedCount}
				onClearSelection={clearSelection}
			>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkSuspend}
					disabled={bulkUpdateMutation.isPending}
				>
					Suspend
				</Button>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkUnsuspend}
					disabled={bulkUpdateMutation.isPending}
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
				sorting={sorting}
				onSortingChange={handleSortingChange}
				defaultPageSize={20}
				searchValue={filters.search ?? ''}
				onSearchChange={value => setFilter('search', value || undefined)}
				searchPlaceholder='Filter by name...'
				filterButtons={
					<div className='flex items-center gap-2'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' size='sm'>
									<ListFilter />
									Filters
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start' className='w-56'>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem
												checked={filters.suspended === false}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('suspended', false);
													} else {
														setFilter('suspended', undefined);
													}
												}}
											>
												Active
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={filters.suspended === true}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('suspended', true);
													} else {
														setFilter('suspended', undefined);
													}
												}}
											>
												Suspended
											</DropdownMenuCheckboxItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Account type</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem
												checked={showRegistered}
												onCheckedChange={checked =>
													setAccountTypes(checked, showGuests)
												}
											>
												Registered
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={showGuests}
												onCheckedChange={checked =>
													setAccountTypes(showRegistered, checked)
												}
											>
												Guest
											</DropdownMenuCheckboxItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>

								{hasActiveFilters && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={clearFilters}>
											Clear Filters
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				}
			/>
		</div>
	);
}
