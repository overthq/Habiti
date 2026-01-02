import { useState } from 'react';
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
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
		header: 'Name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/products/${row.original.id}`}>{row.original.name}</Link>
			</Button>
		)
	},
	{
		accessorKey: 'unitPrice',
		header: 'Price',
		cell: ({ row }) => formatNaira(row.getValue('unitPrice'))
	},
	{
		accessorKey: 'quantity',
		header: 'Stock'
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
													currentSortField === 'unitPrice' &&
													currentSortDirection === 'asc'
												}
												onCheckedChange={() =>
													handleSortChange('unitPrice', 'asc')
												}
											>
												Price (Low to High)
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'unitPrice' &&
													currentSortDirection === 'desc'
												}
												onCheckedChange={() =>
													handleSortChange('unitPrice', 'desc')
												}
											>
												Price (High to Low)
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'quantity' &&
													currentSortDirection === 'asc'
												}
												onCheckedChange={() =>
													handleSortChange('quantity', 'asc')
												}
											>
												Stock (Low to High)
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={
													currentSortField === 'quantity' &&
													currentSortDirection === 'desc'
												}
												onCheckedChange={() =>
													handleSortChange('quantity', 'desc')
												}
											>
												Stock (High to Low)
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
