import { useState, useMemo } from 'react';
import {
	type ColumnDef,
	type RowSelectionState,
	type SortingState
} from '@tanstack/react-table';
import { ListFilter, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { useOrdersQuery } from '@/data/queries';
import { useBulkUpdateOrdersMutation } from '@/data/mutations';
import { type Order, type OrderFilters, OrderStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { ConfirmDialog } from '@/components/confirm-dialog';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTableFilters } from '@/hooks/use-table-filters';
import OrderStatusPill from '@/components/order-status-pill';

const columns: ColumnDef<Order>[] = [
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
		accessorFn: row => row.user.name,
		header: 'Customer',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/users/${row.original.user.id}`}>
					{row.original.user.name}
				</Link>
			</Button>
		)
	},
	{
		header: 'Store',
		accessorKey: 'store.name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/stores/${row.original.store.id}`}>
					{row.original.store.name}
				</Link>
			</Button>
		)
	},
	{
		accessorKey: 'total',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Total' />
		),
		cell: ({ row }) => formatNaira(row.getValue('total'))
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return <OrderStatusPill status={row.original.status} />;
		},
		enableSorting: false
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Created' />
		),
		cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString()
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const navigate = useNavigate();
			const order = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(order.id)}
						>
							Copy order ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => navigate(`/orders/${order.id}`)}>
							View order
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}
	}
];

const defaultFilters: OrderFilters = {
	status: undefined,
	storeId: undefined,
	userId: undefined,
	orderBy: undefined
};

const OrdersPage = () => {
	const { filters, setFilter, clearFilters, hasActiveFilters } =
		useTableFilters({ defaults: defaultFilters });

	const { data, isLoading } = useOrdersQuery(filters);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const bulkUpdateMutation = useBulkUpdateOrdersMutation();

	const selectedIds = Object.keys(rowSelection);
	const selectedCount = selectedIds.length;

	const clearSelection = () => setRowSelection({});

	const handleBulkCancel = () => {
		bulkUpdateMutation.mutate(
			{ ids: selectedIds, field: 'status', value: OrderStatus.Cancelled },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkMarkCompleted = () => {
		bulkUpdateMutation.mutate(
			{ ids: selectedIds, field: 'status', value: OrderStatus.Completed },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkMarkPending = () => {
		bulkUpdateMutation.mutate(
			{ ids: selectedIds, field: 'status', value: OrderStatus.Pending },
			{ onSuccess: () => clearSelection() }
		);
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-semibold'>Orders</h1>
			</div>

			<BulkActionsToolbar
				selectedCount={selectedCount}
				onClearSelection={clearSelection}
			>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkMarkCompleted}
					disabled={bulkUpdateMutation.isPending}
				>
					Mark Completed
				</Button>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkMarkPending}
					disabled={bulkUpdateMutation.isPending}
				>
					Mark Pending
				</Button>
				<ConfirmDialog
					title='Cancel Orders'
					description={`Are you sure you want to cancel ${selectedCount} order(s)? This action cannot be undone.`}
					confirmLabel='Cancel Orders'
					variant='destructive'
					isLoading={bulkUpdateMutation.isPending}
					onConfirm={handleBulkCancel}
					trigger={
						<Button size='sm' variant='destructive'>
							Cancel Orders
						</Button>
					}
				/>
			</BulkActionsToolbar>

			<DataTable
				data={data?.orders ?? []}
				columns={columns}
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
									<DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem
												checked={filters.status === OrderStatus.Pending}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('status', OrderStatus.Pending);
													} else {
														setFilter('status', undefined);
													}
												}}
											>
												Pending
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={filters.status === OrderStatus.PaymentPending}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('status', OrderStatus.PaymentPending);
													} else {
														setFilter('status', undefined);
													}
												}}
											>
												Payment Pending
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={filters.status === OrderStatus.Completed}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('status', OrderStatus.Completed);
													} else {
														setFilter('status', undefined);
													}
												}}
											>
												Completed
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={filters.status === OrderStatus.Cancelled}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('status', OrderStatus.Cancelled);
													} else {
														setFilter('status', undefined);
													}
												}}
											>
												Cancelled
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

export default OrdersPage;
