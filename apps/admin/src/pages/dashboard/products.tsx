import { useState, useMemo } from 'react';
import {
	type ColumnDef,
	type RowSelectionState,
	type SortingState
} from '@tanstack/react-table';
import { ListFilter, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useProductsQuery } from '@/data/queries';
import {
	useBulkDeleteProductsMutation,
	useBulkUpdateProductStatusMutation
} from '@/data/mutations';
import { type Product, type ProductFilters, ProductStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { useTableFilters } from '@/hooks/use-table-filters';

const columns: ColumnDef<Product>[] = [
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
				<Link to={`/products/${row.original.id}`}>{row.original.name}</Link>
			</Button>
		)
	},
	{
		accessorKey: 'unitPrice',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Price' />
		),
		cell: ({ row }) => formatNaira(row.getValue('unitPrice'))
	},
	{
		accessorKey: 'quantity',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Stock' />
		)
	},
	{
		accessorKey: 'store.name',
		header: 'Store',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/stores/${row.original.store.id}`}>
					{row.original.store.name}
				</Link>
			</Button>
		)
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const navigate = useNavigate();
			const product = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(product.id)}
						>
							Copy product ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => navigate(`/products/${product.id}`)}
						>
							View product
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}
	}
];

const defaultFilters: ProductFilters = {
	search: undefined,
	status: undefined,
	storeId: undefined,
	inStock: undefined,
	orderBy: undefined
};

const ProductsPage = () => {
	const { filters, setFilter, clearFilters, hasActiveFilters } =
		useTableFilters({ defaults: defaultFilters });

	const { data, isLoading } = useProductsQuery(filters);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const bulkDeleteMutation = useBulkDeleteProductsMutation();
	const bulkUpdateStatusMutation = useBulkUpdateProductStatusMutation();

	const selectedIds = Object.keys(rowSelection);
	const selectedCount = selectedIds.length;

	const clearSelection = () => setRowSelection({});

	const handleBulkDelete = () => {
		bulkDeleteMutation.mutate(selectedIds, {
			onSuccess: () => clearSelection()
		});
	};

	const handleBulkSetActive = () => {
		bulkUpdateStatusMutation.mutate(
			{ ids: selectedIds, status: ProductStatus.Active },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkSetDraft = () => {
		bulkUpdateStatusMutation.mutate(
			{ ids: selectedIds, status: ProductStatus.Draft },
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
				<h1 className='text-2xl font-semibold'>Products</h1>
			</div>

			<BulkActionsToolbar
				selectedCount={selectedCount}
				onClearSelection={clearSelection}
			>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkSetActive}
					disabled={bulkUpdateStatusMutation.isPending}
				>
					Set Active
				</Button>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkSetDraft}
					disabled={bulkUpdateStatusMutation.isPending}
				>
					Set Draft
				</Button>
				<ConfirmDialog
					title='Delete Products'
					description={`Are you sure you want to delete ${selectedCount} product(s)? This action cannot be undone.`}
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
				data={data?.products ?? []}
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
												<Label>Search Products</Label>
												<Input
													placeholder='Search products...'
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
												checked={filters.status === ProductStatus.Active}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('status', ProductStatus.Active);
													} else {
														setFilter('status', undefined);
													}
												}}
											>
												Active
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={filters.status === ProductStatus.Draft}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('status', ProductStatus.Draft);
													} else {
														setFilter('status', undefined);
													}
												}}
											>
												Draft
											</DropdownMenuCheckboxItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>

								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Stock</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem
												checked={filters.inStock === true}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('inStock', true);
													} else {
														setFilter('inStock', undefined);
													}
												}}
											>
												In Stock
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={filters.inStock === false}
												onCheckedChange={checked => {
													if (checked) {
														setFilter('inStock', false);
													} else {
														setFilter('inStock', undefined);
													}
												}}
											>
												Out of Stock
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

export default ProductsPage;
