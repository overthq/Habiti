'use client';

import { MoreHorizontal } from 'lucide-react';

import { useUsersQuery } from '@/data/queries/users';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/data/services/users';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const columns: ColumnDef<User>[] = [
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
		accessorKey: 'email',
		header: 'Email'
	},
	{
		accessorKey: 'createdAt',
		header: 'Joined',
		cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString()
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const router = useRouter();
			const user = row.original;

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
							onClick={() => navigator.clipboard.writeText(user.id)}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
							View user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}
	}
];

export default function UsersPage() {
	const { data, isLoading } = useUsersQuery();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Users</h1>
			</div>

			<DataTable columns={columns} data={data?.users ?? []} />
		</div>
	);
}
