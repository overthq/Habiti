'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { useOrdersQuery } from '@/data/queries/orders';
import { formatNaira } from '@/utils/format';
import { Order } from '@/data/services/orders';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';

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
		accessorKey: 'id',
		header: 'Order ID',
		cell: ({ row }) => row.getValue('id')
	},
	{
		accessorFn: row => row.user.name,
		header: 'Customer',
		cell: ({ row }) => row.original.user.name
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
	}
];

const OrdersPage = () => {
	const { data, isLoading } = useOrdersQuery();

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
