import { useState } from 'react';
import { Link } from 'react-router';
import { type ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { usePayoutsQuery } from '@/data/queries';
import { PayoutStatus, type PayoutFilters, type Payout } from '@/data/types';
import { formatNaira } from '@/utils/format';

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
		accessorKey: 'store.name'
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
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [minAmount, setMinAmount] = useState<string>('');
	const [maxAmount, setMaxAmount] = useState<string>('');
	const [sortBy, setSortBy] = useState<string>('createdAt');
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
				<h1 className='text-3xl font-bold'>Payouts</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div>
							<Label htmlFor='status'>Status</Label>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder='All statuses' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Statuses</SelectItem>
									<SelectItem value={PayoutStatus.Pending}>Pending</SelectItem>
									<SelectItem value={PayoutStatus.Success}>Success</SelectItem>
									<SelectItem value={PayoutStatus.Failure}>Failure</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor='minAmount'>Min Amount (₦)</Label>
							<Input
								id='minAmount'
								type='number'
								placeholder='0'
								value={minAmount}
								onChange={e => setMinAmount(e.target.value)}
							/>
						</div>

						<div>
							<Label htmlFor='maxAmount'>Max Amount (₦)</Label>
							<Input
								id='maxAmount'
								type='number'
								placeholder='100000'
								value={maxAmount}
								onChange={e => setMaxAmount(e.target.value)}
							/>
						</div>

						<div>
							<Label htmlFor='sortBy'>Sort By</Label>
							<Select
								value={`${sortBy}-${sortOrder}`}
								onValueChange={value => {
									const [field, order] = value.split('-');
									setSortBy(field);
									setSortOrder(order as 'asc' | 'desc');
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='createdAt-desc'>Newest First</SelectItem>
									<SelectItem value='createdAt-asc'>Oldest First</SelectItem>
									<SelectItem value='amount-desc'>Highest Amount</SelectItem>
									<SelectItem value='amount-asc'>Lowest Amount</SelectItem>
									<SelectItem value='status-asc'>Status A-Z</SelectItem>
									<SelectItem value='status-desc'>Status Z-A</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='flex gap-2 mt-4'>
						<Button onClick={applyFilters}>Apply Filters</Button>
						<Button variant='outline' onClick={clearFilters}>
							Clear Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			<DataTable data={payouts} columns={columns} />
		</div>
	);
};

export default PayoutsPage;
