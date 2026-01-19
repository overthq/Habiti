import { ChevronDown, RefreshCw } from 'lucide-react';
import { useParams } from 'react-router';

import { Badge } from '@/components/ui/badge';
import CopyableText from '@/components/ui/copy';
import { Button } from '@/components/ui/button';
import InlineMeta from '@/components/ui/inline-meta';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { usePayoutQuery } from '@/data/queries';
import { Link } from 'react-router';
import { useUpdatePayoutMutation } from '@/data/mutations';
import { PayoutStatus } from '@/data/types';
import { formatNaira } from '@/utils/format';

const getStatusChangeMessage = (targetStatus: PayoutStatus): string => {
	switch (targetStatus) {
		case PayoutStatus.Success:
			return "This will update the store's paid out amount. This action should only be taken after the funds have been transferred.";
		case PayoutStatus.Failure:
			return "This will mark the payout as failed. The store's unrealized revenue will remain unchanged.";
		case PayoutStatus.Pending:
			return 'This will reset the payout to pending status.';
		default:
			return 'Are you sure you want to update this payout status?';
	}
};

const PayoutPage = () => {
	const { id } = useParams();
	const { data: payoutData, isLoading } = usePayoutQuery(id as string);
	const updatePayoutMutation = useUpdatePayoutMutation(id as string);

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
				return <Badge variant='secondary'>Pending</Badge>;
			case PayoutStatus.Success:
				return <Badge variant='default'>Success</Badge>;
			case PayoutStatus.Failure:
				return <Badge variant='destructive'>Failure</Badge>;
			default:
				return <Badge variant='outline'>{status}</Badge>;
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-semibold'>Payout</h1>
					<InlineMeta
						items={[
							<span key='store'>
								Store:{' '}
								<Link
									to={`/stores/${payout.store.id}`}
									className='underline-offset-4 hover:underline'
								>
									{payout.store.name}
								</Link>
							</span>,
							getStatusBadge(payout.status),
							<span key='amount' className='font-medium'>
								{formatNaira(payout.amount)}
							</span>,
							<span key='id'>
								<CopyableText value={payout.id} />
							</span>,
							<span key='created' className='font-mono text-sm'>
								Created {new Date(payout.createdAt).toLocaleString()}
							</span>
						]}
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline'>
							Actions
							<ChevronDown className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<RefreshCw className='mr-2 h-4 w-4' />
								Update status
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{Object.values(PayoutStatus).map(statusOption => (
									<ConfirmDialog
										key={statusOption}
										title='Update Payout Status'
										description={getStatusChangeMessage(statusOption)}
										confirmLabel='Update'
										variant='default'
										isLoading={updatePayoutMutation.isPending}
										onConfirm={() =>
											updatePayoutMutation.mutate({ status: statusOption })
										}
										trigger={
											<DropdownMenuCheckboxItem
												onSelect={e => e.preventDefault()}
												checked={statusOption === payout.status}
											>
												{statusOption}
											</DropdownMenuCheckboxItem>
										}
									/>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default PayoutPage;
