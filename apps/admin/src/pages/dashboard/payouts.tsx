import { useState } from 'react';
import { Link } from 'react-router';
import { type ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { usePayoutsQuery } from '@/data/queries';
import { PayoutStatus, type PayoutFilters, type Payout } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { ListFilter } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const getStatusBadge = (status: PayoutStatus) => {
	switch (status) {
		case PayoutStatus.Pending:
			return <Badge className='bg-yellow-100 text-yellow-800'>Pending</Badge>;
		case PayoutStatus.Success:
			return <Badge className='bg-green-100 text-green-800'>Success</Badge>;
		case PayoutStatus.Failure:
			return <Badge className='bg-red-100 text-red-800'>Failure</Badge>;
		default:
			return <Badge className='bg-gray-100 text-gray-800'>{status}</Badge>;
	}
};

const columns: ColumnDef<Payout>[] = [
	{
		header: 'Store',
		accessorKey: 'store.name',
		cell: ({ row }) => (
			<Button variant='link' asChild className='px-0 w-fit'>
				<Link to={`/stores/${row.original.store.id}`}>
					{row.original.store.name}
				</Link>
			</Button>
		)
	},
	{
		header: 'Amount',
		accessorKey: 'amount',
		cell: ({ row }) => formatNaira(row.getValue('amount'))
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => getStatusBadge(row.original.status)
	},
	{
		header: 'Created',
		accessorKey: 'createdAt',
		cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString()
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const payout = row.original;
			return (
				<Link to={`/payouts/${payout.id}`}>
					<Button variant='outline' size='sm'>
						View Details
					</Button>
				</Link>
			);
		}
	}
];

const PayoutsPage = () => {
	const [filters, setFilters] = useState<PayoutFilters>({});
	const [statusFilter, setStatusFilter] = useState('all');
	const [minAmount, setMinAmount] = useState('');
	const [maxAmount, setMaxAmount] = useState('');
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const { data: payoutsData, isLoading } = usePayoutsQuery(filters);

	const applyFilters = () => {
		const newFilters: PayoutFilters = {
			filter: {},
			orderBy: { [sortBy]: sortOrder }
		};

		if (statusFilter !== 'all') {
			newFilters.filter!.status = { equals: statusFilter };
		}

		if (minAmount) {
			newFilters.filter!.amount = {
				...newFilters.filter!.amount,
				gte: Number(minAmount) * 100
			};
		}

		if (maxAmount) {
			newFilters.filter!.amount = {
				...newFilters.filter!.amount,
				lte: Number(maxAmount) * 100
			};
		}

		setFilters(newFilters);
	};

	const clearFilters = () => {
		setFilters({});
		setStatusFilter('all');
		setMinAmount('');
		setMaxAmount('');
		setSortBy('createdAt');
		setSortOrder('desc');
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const payouts = payoutsData?.payouts || [];

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-semibold'>Payouts</h1>
			</div>

			<DataTable
				data={payouts}
				columns={columns}
				filterButtons={
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' size='sm'>
									<ListFilter />
									Filters
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start'>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Sort By</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem
												checked={sortBy === 'createdAt-desc'}
												onCheckedChange={() => setSortBy('createdAt-desc')}
											>
												Newest First
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={sortBy === 'createdAt-asc'}
												onCheckedChange={() => setSortBy('createdAt-asc')}
											>
												Oldest First
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={sortBy === 'amount-desc'}
												onCheckedChange={() => setSortBy('amount-desc')}
											>
												Highest Amount
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={sortBy === 'amount-asc'}
												onCheckedChange={() => setSortBy('amount-asc')}
											>
												Lowest Amount
											</DropdownMenuCheckboxItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>

								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Amount</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent className='p-4 space-y-4'>
											<div className='space-y-2'>
												<Label>Min Amount</Label>
												<Input
													type='number'
													placeholder='Min Amount'
													value={minAmount}
													onChange={e => setMinAmount(e.target.value)}
												/>
											</div>

											<div className='space-y-2'>
												<Label>Max Amount</Label>
												<Input
													type='number'
													placeholder='Max Amount'
													value={maxAmount}
													onChange={e => setMaxAmount(e.target.value)}
												/>
											</div>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>

								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem
												checked={statusFilter === PayoutStatus.Pending}
												onCheckedChange={() =>
													setStatusFilter(PayoutStatus.Pending)
												}
											>
												Pending
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={statusFilter === PayoutStatus.Success}
												onCheckedChange={() =>
													setStatusFilter(PayoutStatus.Success)
												}
											>
												Success
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem
												checked={statusFilter === PayoutStatus.Failure}
												onCheckedChange={() =>
													setStatusFilter(PayoutStatus.Failure)
												}
											>
												Failure
											</DropdownMenuCheckboxItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* <Button onClick={applyFilters}>Apply Filters</Button>
						<Button onClick={clearFilters}>Clear Filters</Button> */}
					</div>
				}
			/>
		</div>
	);
};

export default PayoutsPage;
