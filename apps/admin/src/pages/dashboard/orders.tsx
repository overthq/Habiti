import { useState } from 'react';
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { useOrdersQuery } from '@/data/queries';
import {
	useBulkCancelOrdersMutation,
	useBulkUpdateOrderStatusMutation
} from '@/data/mutations';
import { type Order, type OrderFilters, OrderStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { ConfirmDialog } from '@/components/confirm-dialog';
import {
	FilterBar,
	SelectFilter,
	SortSelect
} from '@/components/table-filters';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTableFilters } from '@/hooks/use-table-filters';

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
		header: 'Total',
		cell: ({ row }) => formatNaira(row.getValue('total'))
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.status;
			const statusColors: Record<OrderStatus, string> = {
				[OrderStatus.Pending]: 'text-yellow-600',
				[OrderStatus.PaymentPending]: 'text-orange-600',
				[OrderStatus.Completed]: 'text-green-600',
				[OrderStatus.Cancelled]: 'text-destructive'
			};
			return <span className={statusColors[status]}>{status}</span>;
		}
	},
	{
		accessorKey: 'createdAt',
		header: 'Created',
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

	const bulkCancelMutation = useBulkCancelOrdersMutation();
	const bulkUpdateStatusMutation = useBulkUpdateOrderStatusMutation();

	const selectedIds = Object.keys(rowSelection);
	const selectedCount = selectedIds.length;

	const clearSelection = () => setRowSelection({});

	const handleBulkCancel = () => {
		bulkCancelMutation.mutate(selectedIds, {
			onSuccess: () => clearSelection()
		});
	};

	const handleBulkMarkCompleted = () => {
		bulkUpdateStatusMutation.mutate(
			{ ids: selectedIds, status: OrderStatus.Completed },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkMarkPending = () => {
		bulkUpdateStatusMutation.mutate(
			{ ids: selectedIds, status: OrderStatus.Pending },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleSortChange = (
		value: { field: string; direction: 'asc' | 'desc' } | undefined
	) => {
		if (value) {
			setFilter('orderBy', { [value.field]: value.direction });
		} else {
			setFilter('orderBy', undefined);
		}
	};

	// Convert orderBy object to sort value for the select
	const currentSort = filters.orderBy
		? {
				field: Object.keys(filters.orderBy)[0],
				direction: Object.values(filters.orderBy)[0] as 'asc' | 'desc'
			}
		: undefined;

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-semibold'>Orders</h1>
			</div>

			<BulkActionsToolbar
				selectedCount={selectedCount}
				onClearSelection={clearSelection}
			>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkMarkCompleted}
					disabled={bulkUpdateStatusMutation.isPending}
				>
					Mark Completed
				</Button>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkMarkPending}
					disabled={bulkUpdateStatusMutation.isPending}
				>
					Mark Pending
				</Button>
				<ConfirmDialog
					title='Cancel Orders'
					description={`Are you sure you want to cancel ${selectedCount} order(s)? This action cannot be undone.`}
					confirmLabel='Cancel Orders'
					variant='destructive'
					isLoading={bulkCancelMutation.isPending}
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
				filterButtons={
					<FilterBar
						hasActiveFilters={hasActiveFilters}
						onClearFilters={clearFilters}
					>
						<SelectFilter
							value={filters.status}
							onChange={value => setFilter('status', value as OrderStatus)}
							options={[
								{ label: 'Pending', value: OrderStatus.Pending },
								{ label: 'Payment Pending', value: OrderStatus.PaymentPending },
								{ label: 'Completed', value: OrderStatus.Completed },
								{ label: 'Cancelled', value: OrderStatus.Cancelled }
							]}
							placeholder='Status'
						/>
						<SortSelect
							value={currentSort}
							onChange={handleSortChange}
							options={[
								{ label: 'Total', value: 'total' },
								{ label: 'Created At', value: 'createdAt' }
							]}
							placeholder='Sort by...'
						/>
					</FilterBar>
				}
			/>
		</div>
	);
};

export default OrdersPage;
