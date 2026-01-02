import { useState, useMemo } from 'react';
import {
	type ColumnDef,
	type RowSelectionState,
	type SortingState
} from '@tanstack/react-table';
import { ListFilter } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useUsersQuery } from '@/data/queries';
import {
	useBulkSuspendUsersMutation,
	useBulkUnsuspendUsersMutation,
	useBulkDeleteUsersMutation
} from '@/data/mutations';
import { type User, type UserFilters } from '@/data/types';
import { useTableFilters } from '@/hooks/use-table-filters';

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
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/users/${row.original.id}`}>{row.original.name}</Link>
			</Button>
		)
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		)
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

const defaultFilters: UserFilters = {
	search: undefined,
	suspended: undefined,
	orderBy: undefined
};

const Users = () => {
	const { filters, setFilter, clearFilters, hasActiveFilters } =
		useTableFilters({ defaults: defaultFilters });

	const { data, isLoading } = useUsersQuery(filters);
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

	// Convert orderBy filter to SortingState
	const sorting = useMemo<SortingState>(() => {
		if (!filters.orderBy) return [];
		const field = Object.keys(filters.orderBy)[0];
		const direction = Object.values(filters.orderBy)[0] as 'asc' | 'desc';
		return [{ id: field, desc: direction === 'desc' }];
	}, [filters.orderBy]);

	// Handle sorting changes from column headers
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
				sorting={sorting}
				onSortingChange={handleSortingChange}
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
									<DropdownMenuSubTrigger>Search</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent className='p-4'>
											<div className='space-y-2'>
												<Label>Search Users</Label>
												<Input
													placeholder='Search users...'
													value={filters.search ?? ''}
													onChange={e =>
														setFilter('search', e.target.value || undefined)
													}
												/>
											</div>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>

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
};

export default Users;
