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
import { useProductsQuery } from '@/data/queries';
import { type Product } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

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
			<Link to={`/products/${row.original.id}`}>{row.original.name}</Link>
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
		accessorKey: 'storeId',
		header: 'Store'
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

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
