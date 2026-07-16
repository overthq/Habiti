import * as React from 'react';
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type RowSelectionState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/table-filters';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from './table';
import {
	ChevronsRight,
	ChevronRight,
	ChevronLeft,
	ChevronsLeft
} from 'lucide-react';
import { Label } from './label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from './select';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterButtons?: React.ReactNode;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	searchPlaceholder?: string;
	defaultPageSize?: number;
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: (selection: RowSelectionState) => void;
	getRowId?: (row: TData) => string;
	sorting?: SortingState;
	onSortingChange?: (sorting: SortingState) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filterButtons,
	searchValue,
	onSearchChange,
	searchPlaceholder,
	defaultPageSize = 10,
	rowSelection,
	onRowSelectionChange,
	getRowId,
	sorting: externalSorting,
	onSortingChange: externalOnSortingChange
}: DataTableProps<TData, TValue>) {
	const [internalSorting, setInternalSorting] = React.useState<SortingState>(
		[]
	);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [internalRowSelection, setInternalRowSelection] =
		React.useState<RowSelectionState>({});

	const sorting = externalSorting ?? internalSorting;
	const handleSortingChange = (
		updaterOrValue: SortingState | ((old: SortingState) => SortingState)
	) => {
		const newValue =
			typeof updaterOrValue === 'function'
				? updaterOrValue(sorting)
				: updaterOrValue;
		if (externalOnSortingChange) {
			externalOnSortingChange(newValue);
		} else {
			setInternalSorting(newValue);
		}
	};

	const effectiveRowSelection = rowSelection ?? internalRowSelection;
	const handleRowSelectionChange = (
		updaterOrValue:
			| RowSelectionState
			| ((old: RowSelectionState) => RowSelectionState)
	) => {
		const newValue =
			typeof updaterOrValue === 'function'
				? updaterOrValue(effectiveRowSelection)
				: updaterOrValue;
		if (onRowSelectionChange) {
			onRowSelectionChange(newValue);
		} else {
			setInternalRowSelection(newValue);
		}
	};

	const table = useReactTable({
		data,
		columns,
		onSortingChange: handleSortingChange,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: handleRowSelectionChange,
		getRowId,
		initialState: {
			pagination: { pageSize: defaultPageSize }
		},
		state: {
			sorting,
			columnFilters,
			rowSelection: effectiveRowSelection
		}
	});

	return (
		<div className='space-y-4'>
			{(onSearchChange || filterButtons) && (
				<div className='flex items-center gap-2'>
					{onSearchChange && (
						<SearchInput
							value={searchValue ?? ''}
							onChange={onSearchChange}
							placeholder={searchPlaceholder}
						/>
					)}
					{filterButtons}
				</div>
			)}

			<div className='rounded-md border overflow-hidden'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-between px-4'>
				<div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className='flex w-full items-center gap-8 lg:w-fit'>
					<div className='hidden items-center gap-2 lg:flex'>
						<Label htmlFor='rows-per-page' className='text-sm font-medium'>
							Rows per page
						</Label>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={value => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger size='sm' className='w-20' id='rows-per-page'>
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side='top'>
								{[10, 20, 30, 40, 50].map(pageSize => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='flex w-fit items-center justify-center text-sm font-medium'>
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</div>
					<div className='ml-auto flex items-center gap-2 lg:ml-0'>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to first page</span>
							<ChevronsLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant='outline'
							className='size-8'
							size='icon'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to next page</span>
							<ChevronRight />
						</Button>
						<Button
							variant='outline'
							className='hidden size-8 lg:flex'
							size='icon'
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to last page</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
