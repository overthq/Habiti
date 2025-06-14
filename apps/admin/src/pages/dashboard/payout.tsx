import { useParams } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { usePayoutQuery } from '@/data/queries';
import { useUpdatePayoutMutation } from '@/data/mutations';
import { PayoutStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';
import { useState } from 'react';

const PayoutPage = () => {
	const { id } = useParams();
	const { data: payoutData, isLoading } = usePayoutQuery(id as string);
	const updatePayoutMutation = useUpdatePayoutMutation(id as string);
	const [selectedStatus, setSelectedStatus] = useState<PayoutStatus | ''>('');

	if (isLoading || !id) {
		return <div>Loading...</div>;
	}

	if (!payoutData?.payout) {
		return <div>Payout not found</div>;
	}

	const payout = payoutData.payout;

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

	const handleStatusUpdate = () => {
		if (selectedStatus && selectedStatus !== payout.status) {
			updatePayoutMutation.mutate({ status: selectedStatus });
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Payout Details</h1>
				{getStatusBadge(payout.status)}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Payout Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-gray-500'>ID</p>
							<p className='font-mono text-sm'>{payout.id}</p>
						</div>
						<div>
							<p className='text-gray-500'>Amount</p>
							<p className='font-semibold text-lg'>
								{formatNaira(payout.amount)}
							</p>
						</div>
						<div>
							<p className='text-gray-500'>Status</p>
							{getStatusBadge(payout.status)}
						</div>
						<div>
							<p className='text-gray-500'>Store ID</p>
							<p className='font-mono text-sm'>{payout.storeId}</p>
						</div>
						<div>
							<p className='text-gray-500'>Created At</p>
							<p>{new Date(payout.createdAt).toLocaleString()}</p>
						</div>
						<div>
							<p className='text-gray-500'>Updated At</p>
							<p>{new Date(payout.updatedAt).toLocaleString()}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Store Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-gray-500'>Store Name</p>
							<p className='font-semibold'>{payout.store.name}</p>
						</div>
						<div>
							<p className='text-gray-500'>Store ID</p>
							<p className='font-mono text-sm'>{payout.store.id}</p>
						</div>
						<div>
							<p className='text-gray-500'>Description</p>
							<p>{payout.store.description || 'No description'}</p>
						</div>
						<div>
							<p className='text-gray-500'>Status</p>
							<Badge
								className={
									payout.store.unlisted
										? 'bg-red-100 text-red-800'
										: 'bg-green-100 text-green-800'
								}
							>
								{payout.store.unlisted ? 'Unlisted' : 'Listed'}
							</Badge>
						</div>
						{'bankAccountNumber' in payout.store &&
							payout.store.bankAccountNumber && (
								<>
									<div>
										<p className='text-gray-500'>Bank Account</p>
										<p className='font-mono'>
											{payout.store.bankAccountNumber}
										</p>
									</div>
									<div>
										<p className='text-gray-500'>Bank Code</p>
										<p className='font-mono'>{payout.store.bankCode}</p>
									</div>
								</>
							)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Update Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex items-center gap-4'>
						<div className='flex-1'>
							<Select
								value={selectedStatus}
								onValueChange={value =>
									setSelectedStatus(value as PayoutStatus)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder={`Current: ${payout.status}`} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={PayoutStatus.Pending}>Pending</SelectItem>
									<SelectItem value={PayoutStatus.Success}>Success</SelectItem>
									<SelectItem value={PayoutStatus.Failure}>Failure</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							onClick={handleStatusUpdate}
							disabled={
								!selectedStatus ||
								selectedStatus === payout.status ||
								updatePayoutMutation.isPending
							}
						>
							{updatePayoutMutation.isPending ? 'Updating...' : 'Update Status'}
						</Button>
					</div>
					<p className='text-sm text-gray-500 mt-2'>
						Note: Changing status to "Success" will update the store's paid out
						amount.
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default PayoutPage;
