import { useState } from 'react';
import { type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
import { Link } from 'react-router';

import { type Store } from '@/data/types';
import { useStoresQuery } from '@/data/queries';
import {
	useBulkUpdateStoresMutation,
	useBulkDeleteStoresMutation
} from '@/data/mutations';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BulkActionsToolbar } from '@/components/bulk-actions-toolbar';
import { ConfirmDialog } from '@/components/confirm-dialog';
import CreateStoreDialog from '@/components/stores/create-store-dialog';

const columns: ColumnDef<Store>[] = [
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
				<Link to={`/stores/${row.original.id}`}>{row.original.name}</Link>
			</Button>
		)
	},
	{
		accessorKey: 'unlisted',
		header: 'Status',
		cell: ({ row }) => (
			<Badge variant={row.original.unlisted ? 'secondary' : 'default'}>
				{row.original.unlisted ? 'Unlisted' : 'Listed'}
			</Badge>
		)
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
	}
];

const Stores = () => {
	const { data, isLoading } = useStoresQuery();
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const bulkUpdateMutation = useBulkUpdateStoresMutation();
	const bulkDeleteMutation = useBulkDeleteStoresMutation();

	const selectedIds = Object.keys(rowSelection);
	const selectedCount = selectedIds.length;

	const clearSelection = () => setRowSelection({});

	const handleBulkList = () => {
		bulkUpdateMutation.mutate(
			{ ids: selectedIds, field: 'unlisted', value: false },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkUnlist = () => {
		bulkUpdateMutation.mutate(
			{ ids: selectedIds, field: 'unlisted', value: true },
			{ onSuccess: () => clearSelection() }
		);
	};

	const handleBulkDelete = () => {
		bulkDeleteMutation.mutate(selectedIds, {
			onSuccess: () => clearSelection()
		});
	};

	if (isLoading) return <div />;

	if (!data) return <div>No data</div>;

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-semibold'>Stores</h1>
				<CreateStoreDialog />
			</div>

			<BulkActionsToolbar
				selectedCount={selectedCount}
				onClearSelection={clearSelection}
			>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkList}
					disabled={bulkUpdateMutation.isPending}
				>
					List
				</Button>
				<Button
					size='sm'
					variant='outline'
					onClick={handleBulkUnlist}
					disabled={bulkUpdateMutation.isPending}
				>
					Unlist
				</Button>
				<ConfirmDialog
					title='Delete Stores'
					description={`Are you sure you want to delete ${selectedCount} store(s)? This action cannot be undone.`}
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
				data={data.stores}
				rowSelection={rowSelection}
				onRowSelectionChange={setRowSelection}
				getRowId={row => row.id}
			/>
		</div>
	);
};

export default Stores;
