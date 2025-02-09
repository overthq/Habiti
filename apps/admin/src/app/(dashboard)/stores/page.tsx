'use client';

import { useStoresQuery } from '@/data/queries/stores';
import { ColumnDef } from '@tanstack/react-table';
import { Store } from '@/data/services/stores';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
		header: 'Name'
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const router = useRouter();
			const store = row.original;

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
							onClick={() => navigator.clipboard.writeText(row.original.id)}
						>
							Copy store ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => router.push(`/stores/${row.original.id}`)}
						>
							View store
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}
	}
];

export default function StoresPage() {
	const { data, isLoading } = useStoresQuery();
	const router = useRouter();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Stores</h1>
			</div>

			<DataTable columns={columns} data={data?.stores ?? []} />
		</div>
	);
}
