import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { BANKS } from '@habiti/common';

import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../ui/dialog';
import { ConfirmDialog } from '../confirm-dialog';
import StatusPill from '../status-pill';
import { cn } from '@/lib/utils';
import { useStorePayoutAccountsQuery } from '@/data/queries';
import {
	useAddStorePayoutAccountMutation,
	useRemoveStorePayoutAccountMutation,
	useSetDefaultStorePayoutAccountMutation,
	useVerifyBankAccountMutation
} from '@/data/mutations';
import {
	type PayoutAccount,
	type VerifyBankAccountResponse
} from '@/data/types';

const describeAccount = (account: PayoutAccount) =>
	`${account.bankName ?? account.bankCode} ••••${account.accountNumber.slice(-4)}`;

const PayoutAccountActions = ({
	storeId,
	account
}: {
	storeId: string;
	account: PayoutAccount;
}) => {
	const setDefaultMutation = useSetDefaultStorePayoutAccountMutation(storeId);
	const removeMutation = useRemoveStorePayoutAccountMutation(storeId);

	return (
		<div className='flex justify-end gap-2'>
			{!account.isDefault && (
				<Button
					size='sm'
					variant='outline'
					disabled={setDefaultMutation.isPending}
					onClick={() => setDefaultMutation.mutate(account.id)}
				>
					Make default
				</Button>
			)}
			<ConfirmDialog
				title='Remove payout account'
				description={`Remove ${describeAccount(account)}? If this is the store's only account, it will not be able to receive payouts until a new one is linked.`}
				confirmLabel='Remove'
				variant='destructive'
				isLoading={removeMutation.isPending}
				onConfirm={() => removeMutation.mutate(account.id)}
				trigger={
					<Button size='sm' variant='outline'>
						Remove
					</Button>
				}
			/>
		</div>
	);
};

const LinkBankAccountDialog = ({
	storeId,
	currentAccount
}: {
	storeId: string;
	currentAccount: PayoutAccount | undefined;
}) => {
	const [open, setOpen] = useState(false);
	const [bankSearch, setBankSearch] = useState('');
	const [bankCode, setBankCode] = useState<string>();
	const [accountNumber, setAccountNumber] = useState('');
	const [label, setLabel] = useState('');
	const [verified, setVerified] = useState<VerifyBankAccountResponse>();

	const verifyMutation = useVerifyBankAccountMutation();
	const addMutation = useAddStorePayoutAccountMutation(storeId);

	const banks = useMemo(() => {
		const query = bankSearch.trim().toLowerCase();
		const active = BANKS.filter(bank => bank.active && !bank.is_deleted);
		if (!query) return active;
		return active.filter(bank => bank.name.toLowerCase().includes(query));
	}, [bankSearch]);

	const selectedBank = BANKS.find(bank => bank.code === bankCode);
	const canVerify = !!bankCode && /^\d{10}$/.test(accountNumber);

	const reset = () => {
		setBankSearch('');
		setBankCode(undefined);
		setAccountNumber('');
		setLabel('');
		setVerified(undefined);
	};

	const handleVerify = () => {
		if (!bankCode) return;
		verifyMutation.mutate(
			{ bankAccountNumber: accountNumber, bankCode },
			{ onSuccess: setVerified }
		);
	};

	const handleLink = () => {
		if (!bankCode || !verified) return;
		addMutation.mutate(
			{
				bankAccountNumber: accountNumber,
				bankCode,
				label: label.trim() || undefined,
				replaceExisting: !!currentAccount
			},
			{
				onSuccess: () => {
					setOpen(false);
					reset();
				}
			}
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={next => {
				setOpen(next);
				if (!next) reset();
			}}
		>
			<DialogTrigger asChild>
				<Button size='sm'>Link bank account</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Link bank account</DialogTitle>
					<DialogDescription>
						Payouts for this store will be sent to this account.
					</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='bank-search'>Bank</Label>
						<Input
							id='bank-search'
							placeholder={selectedBank?.name ?? 'Search banks'}
							value={bankSearch}
							onChange={e => setBankSearch(e.target.value)}
						/>
						<div className='max-h-48 overflow-y-auto rounded-md border'>
							{banks.length === 0 ? (
								<p className='p-3 text-sm text-muted-foreground'>
									No banks match "{bankSearch}"
								</p>
							) : (
								banks.map(bank => (
									<button
										key={bank.id}
										type='button'
										className={cn(
											'block w-full px-3 py-2 text-left text-sm hover:bg-accent',
											bank.code === bankCode && 'bg-accent font-medium'
										)}
										onClick={() => {
											setBankCode(bank.code);
											setVerified(undefined);
										}}
									>
										{bank.name}
									</button>
								))
							)}
						</div>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='account-number'>Account number</Label>
						<div className='flex gap-2'>
							<Input
								id='account-number'
								inputMode='numeric'
								maxLength={10}
								placeholder='0123456789'
								value={accountNumber}
								onChange={e => {
									setAccountNumber(e.target.value.replace(/\D/g, ''));
									setVerified(undefined);
								}}
							/>
							<Button
								type='button'
								variant='outline'
								disabled={!canVerify || verifyMutation.isPending}
								onClick={handleVerify}
							>
								Verify
							</Button>
						</div>
					</div>

					{verified && (
						<div className='rounded-md border bg-muted/50 p-3 text-sm'>
							<p className='text-muted-foreground'>Account name</p>
							<p className='font-medium'>{verified.accountName}</p>
						</div>
					)}

					<div className='grid gap-2'>
						<Label htmlFor='account-label'>Label (optional)</Label>
						<Input
							id='account-label'
							maxLength={64}
							value={label}
							onChange={e => setLabel(e.target.value)}
						/>
					</div>

					{currentAccount && (
						<p className='text-sm text-destructive'>
							This will replace the store's current payout account (
							{describeAccount(currentAccount)}).
						</p>
					)}
				</div>

				<DialogFooter>
					<Button
						disabled={!verified || addMutation.isPending}
						onClick={handleLink}
					>
						{currentAccount ? 'Replace account' : 'Link account'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const StorePayoutAccounts = ({ storeId }: { storeId: string }) => {
	const { data } = useStorePayoutAccountsQuery(storeId);

	const columns = useMemo<ColumnDef<PayoutAccount>[]>(
		() => [
			{
				header: 'Bank',
				accessorKey: 'bankName',
				cell: ({ row }) => row.original.bankName ?? row.original.bankCode
			},
			{ header: 'Account number', accessorKey: 'accountNumber' },
			{
				header: 'Account name',
				accessorKey: 'accountName',
				cell: ({ row }) => row.original.accountName ?? '—'
			},
			{
				header: 'Label',
				accessorKey: 'label',
				cell: ({ row }) => row.original.label ?? '—'
			},
			{
				header: 'Default',
				accessorKey: 'isDefault',
				cell: ({ row }) =>
					row.original.isDefault ? (
						<StatusPill tone='green' label='Default' />
					) : null
			},
			{
				header: 'Added',
				accessorKey: 'createdAt',
				cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
			},
			{
				id: 'actions',
				cell: ({ row }) => (
					<PayoutAccountActions storeId={storeId} account={row.original} />
				)
			}
		],
		[storeId]
	);

	if (!data) return null;

	const currentAccount =
		data.payoutAccounts.find(account => account.isDefault) ??
		data.payoutAccounts[0];

	return (
		<div className='space-y-4'>
			<div className='flex justify-end'>
				<LinkBankAccountDialog
					storeId={storeId}
					currentAccount={currentAccount}
				/>
			</div>
			<DataTable columns={columns} data={data.payoutAccounts} />
		</div>
	);
};

export default StorePayoutAccounts;
