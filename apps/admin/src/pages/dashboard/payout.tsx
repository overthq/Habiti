import { useParams } from 'react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CopyableText from '@/components/ui/copy';
import { Button } from '@/components/ui/button';
import InlineMeta from '@/components/ui/inline-meta';
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
	const bankAccountNumber = (
		payout.store as unknown as { bankAccountNumber?: string }
	).bankAccountNumber;
	const bankCode = (payout.store as unknown as { bankCode?: string }).bankCode;

	const getStatusBadge = (status: PayoutStatus) => {
		switch (status) {
			case PayoutStatus.Pending:
				return <Badge variant='secondary'>Pending</Badge>;
			case PayoutStatus.Success:
				return <Badge variant='default'>Success</Badge>;
			case PayoutStatus.Failure:
				return <Badge variant='destructive'>Failure</Badge>;
			default:
				return <Badge variant='outline'>{status}</Badge>;
		}
	};

	const handleStatusUpdate = () => {
		if (selectedStatus && selectedStatus !== payout.status) {
			updatePayoutMutation.mutate({ status: selectedStatus });
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-3xl font-semibold tracking-tight'>Payout</h1>
					<InlineMeta
						items={[
							getStatusBadge(payout.status),
							<span key='amount' className='font-medium'>
								{formatNaira(payout.amount)}
							</span>,
							<span key='id'>
								<CopyableText value={payout.id} />
							</span>
						]}
					/>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Identifiers</CardTitle>
				</CardHeader>
				<CardContent>
					<InlineMeta
						items={[
							<span key='store'>
								Store: <CopyableText value={payout.storeId} />
							</span>,
							<span key='created' className='font-mono text-sm'>
								Created {new Date(payout.createdAt).toLocaleString()}
							</span>,
							<span key='updated' className='font-mono text-sm'>
								Updated {new Date(payout.updatedAt).toLocaleString()}
							</span>
						]}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Store Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<p className='text-muted-foreground text-sm'>Store Name</p>
							<p className='font-semibold'>{payout.store.name}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Store ID</p>
							<CopyableText value={payout.store.id} />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Description</p>
							<p>{payout.store.description || 'No description'}</p>
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Status</p>
							<Badge variant={payout.store.unlisted ? 'secondary' : 'default'}>
								{payout.store.unlisted ? 'Unlisted' : 'Listed'}
							</Badge>
						</div>
						{bankAccountNumber ? (
							<>
								<div>
									<p className='text-muted-foreground text-sm'>Bank Account</p>
									<p className='font-mono text-sm'>{bankAccountNumber}</p>
								</div>
								<div>
									<p className='text-muted-foreground text-sm'>Bank Code</p>
									<p className='font-mono text-sm'>{bankCode ?? '—'}</p>
								</div>
							</>
						) : null}
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
