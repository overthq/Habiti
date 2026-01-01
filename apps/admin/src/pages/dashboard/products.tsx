import { useState } from 'react';
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
import { type Product, ProductStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';

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

const ProductsPage = () => {
	const { data, isLoading } = useProductsQuery();
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-semibold'>Products</h1>
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
			/>
		</div>
	);
};

export default ProductsPage;
