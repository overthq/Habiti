'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenuItem,
	DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useProductsQuery } from '@/data/queries/products';
import { Product } from '@/data/services/products';
import { formatNaira } from '@/utils/format';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
		header: 'Name'
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
		accessorKey: 'storeId',
		header: 'Store'
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const router = useRouter();
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
							onClick={() => router.push(`/products/${product.id}`)}
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

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Products</h1>
			</div>

			<DataTable columns={columns} data={data?.products ?? []} />
		</div>
	);
};

export default ProductsPage;

export const runtime = 'edge';
