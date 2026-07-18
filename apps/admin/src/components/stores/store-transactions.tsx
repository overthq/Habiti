import { DataTable } from '../ui/data-table';
import { useStoreTransactionsQuery } from '@/data/queries';
import { useUpdateTransactionMutation } from '@/data/mutations';
import { type ColumnDef } from '@tanstack/react-table';
import {
	type Transaction,
	TransactionStatus,
	TransactionType
} from '@/data/types';
import { formatNaira } from '@/utils/format';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import StatusPill, { type StatusTone } from '@/components/status-pill';
import { MoreHorizontal } from 'lucide-react';

const CREDIT_TYPES: TransactionType[] = [
	TransactionType.Revenue,
	TransactionType.Adjustment,
	TransactionType.Refund
];

const transactionLabel: Record<TransactionType, string> = {
	[TransactionType.Revenue]: 'Payment received',
	[TransactionType.Payout]: 'Payout',
	[TransactionType.SubscriptionFee]: 'Subscription fee',
	[TransactionType.Adjustment]: 'Adjustment',
	[TransactionType.Refund]: 'Refund'
};

const statusTones: Record<TransactionStatus, StatusTone> = {
	[TransactionStatus.Processing]: 'yellow',
	[TransactionStatus.Success]: 'green',
	[TransactionStatus.Failure]: 'red'
};

const PayoutActions = ({
	transaction,
	storeId
}: {
	transaction: Transaction;
	storeId: string;
}) => {
	const mutation = useUpdateTransactionMutation(transaction.id, storeId);

	if (
		transaction.type !== TransactionType.Payout ||
		transaction.status !== TransactionStatus.Processing
	) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='size-8'>
					<MoreHorizontal className='size-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem
					onClick={() => mutation.mutate({ status: TransactionStatus.Success })}
				>
					Mark as Success
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => mutation.mutate({ status: TransactionStatus.Failure })}
					className='text-destructive'
				>
					Mark as Failed
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const StoreTransactions = ({ storeId }: { storeId: string }) => {
	const { data } = useStoreTransactionsQuery(storeId);

	const columns: ColumnDef<Transaction>[] = [
		{
			header: 'Type',
			accessorKey: 'type',
			cell: ({ row }) => transactionLabel[row.original.type]
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: ({ row }) => {
				const status = row.original.status;
				return <StatusPill tone={statusTones[status]} label={status} />;
			}
		},
		{
			header: 'Amount',
			accessorKey: 'amount',
			cell: ({ row }) => {
				const credit = CREDIT_TYPES.includes(row.original.type);
				return `${credit ? '+' : '-'}${formatNaira(row.original.amount)}`;
			}
		},
		{
			header: 'Balance After',
			accessorKey: 'balanceAfter',
			cell: ({ row }) => formatNaira(row.original.balanceAfter)
		},
		{
			header: 'Description',
			accessorKey: 'description',
			cell: ({ row }) => row.original.description ?? '-'
		},
		{
			header: 'Date',
			accessorKey: 'createdAt',
			cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
		},
		{
			id: 'actions',
			header: '',
			cell: ({ row }) => (
				<PayoutActions transaction={row.original} storeId={storeId} />
			)
		}
	];

	if (!data) return null;

	return (
		<div>
			<DataTable columns={columns} data={data.transactions} />
		</div>
	);
};

export default StoreTransactions;
