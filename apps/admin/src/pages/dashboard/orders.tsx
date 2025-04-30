import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { useOrdersQuery } from '@/data/queries';
import { Order } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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
			<Link to={`/orders/${row.original.id}`}>{row.original.user.name}</Link>
		)
	},
	{
		header: 'Store',
		accessorKey: 'store.name'
	},
	{
		accessorKey: 'total',
		header: 'Total',
		cell: ({ row }) => formatNaira(row.getValue('total'))
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
						<DropdownMenuItem
							onClick={() => navigate(`/dashboard/order/${order.id}`)}
						>
							View order
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}
	}
];

const OrdersPage = () => {
	const { data, isLoading } = useOrdersQuery();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Orders</h1>
			</div>

			<DataTable data={data?.orders ?? []} columns={columns} />
		</div>
	);
};

export default OrdersPage;
