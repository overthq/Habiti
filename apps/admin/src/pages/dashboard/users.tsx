import { useState } from 'react';
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
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

	const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
		setFilter('orderBy', { [field]: direction });
	};

	// Get current sort state
	const currentSortField = filters.orderBy
		? Object.keys(filters.orderBy)[0]
		: undefined;
	const currentSortDirection = filters.orderBy
		? Object.values(filters.orderBy)[0]
		: undefined;

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
									<DropdownMenuSubTrigger>Sort By</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'name' &&
													currentSortDirection === 'asc'
												}
												onCheckedChange={() => handleSortChange('name', 'asc')}
											>
												Name (A-Z)
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'name' &&
													currentSortDirection === 'desc'
												}
												onCheckedChange={() => handleSortChange('name', 'desc')}
											>
												Name (Z-A)
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'email' &&
													currentSortDirection === 'asc'
												}
												onCheckedChange={() => handleSortChange('email', 'asc')}
											>
												Email (A-Z)
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'email' &&
													currentSortDirection === 'desc'
												}
												onCheckedChange={() =>
													handleSortChange('email', 'desc')
												}
											>
												Email (Z-A)
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'createdAt' &&
													currentSortDirection === 'desc'
												}
												onCheckedChange={() =>
													handleSortChange('createdAt', 'desc')
												}
											>
												Newest First
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'createdAt' &&
													currentSortDirection === 'asc'
												}
												onCheckedChange={() =>
													handleSortChange('createdAt', 'asc')
												}
											>
												Oldest First
											</DropdownMenuCheckboxItem>
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
