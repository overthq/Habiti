import React from 'react';
import {
	Button,
	ScrollableScreen,
	Spacer,
	TextButton,
	Typography,
	useTheme
} from '@habiti/components';
import { formatNaira } from '@habiti/common';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getBankTransfer, initiateBankTransfer } from '../data/requests';
import type { BankTransfer as BankTransferDetails } from '../data/types';
import { AppStackParamList } from '../navigation/types';

const POLL_MS = 10_000;

const messageFrom = (error: unknown) => {
	const message = (error as { response?: { data?: { message?: unknown } } })
		?.response?.data?.message;

	if (message === 'Order is not in payment pending state') {
		return 'This order is no longer waiting for payment.';
	}

	if (message === 'Payment failed' || message === 'Internal server error') {
		return 'Bank transfer is unavailable right now. You can pay with card instead.';
	}

	if (typeof message === 'string') return message;

	return 'We could not start this transfer. Try again.';
};

const formatRemaining = (ms: number) => {
	const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const BankTransferScreen = () => {
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modal.BankTransfer'>>();
	const orderId = params.orderId;
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	const [transfer, setTransfer] = React.useState<BankTransferDetails | null>(
		null
	);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [checking, setChecking] = React.useState(false);
	const [copied, setCopied] = React.useState(false);
	const [now, setNow] = React.useState(() => Date.now());

	const start = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		setChecking(false);

		try {
			const { bankTransfer } = await initiateBankTransfer(orderId);
			setTransfer(bankTransfer);

			if (bankTransfer.status === 'Succeeded') {
				queryClient.invalidateQueries({ queryKey: ['orders'] });
			}
		} catch (err) {
			setError(messageFrom(err));
		} finally {
			setLoading(false);
		}
	}, [orderId, queryClient]);

	React.useEffect(() => {
		start();
	}, [start]);

	React.useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	const remaining = transfer ? new Date(transfer.expiresAt).getTime() - now : 0;
	const expired = !!transfer && remaining <= 0;
	const pending = transfer?.status === 'Pending';

	React.useEffect(() => {
		if (!pending) return;

		let cancelled = false;

		const poll = async () => {
			try {
				const { bankTransfer } = await getBankTransfer(orderId);

				if (cancelled) return;

				setTransfer(bankTransfer);

				if (bankTransfer.status === 'Succeeded') {
					queryClient.invalidateQueries({ queryKey: ['orders'] });
				}
			} catch {
				// Leave the account on screen. The next poll retries.
			}
		};

		// Paystack asks callers to wait before the first status check. Tapping
		// "I've sent the money", or hitting expiry, checks immediately.
		if (checking || expired) poll();

		const id = setInterval(poll, POLL_MS);

		return () => {
			cancelled = true;
			clearInterval(id);
		};
	}, [checking, expired, orderId, pending, queryClient]);

	const copyAccountNumber = async () => {
		if (!transfer) return;

		await Clipboard.setStringAsync(transfer.accountNumber);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator />
			</View>
		);
	}

	if (error || !transfer) {
		return (
			<ScrollableScreen style={{ paddingBottom: bottom }}>
				<Spacer y={16} />
				<Typography weight='medium' size='large'>
					Bank transfer unavailable
				</Typography>
				<Spacer y={8} />
				<Typography variant='secondary'>
					{error ?? 'We could not start this transfer. Try again.'}
				</Typography>
				<Spacer y={16} />
				<Button text='Try again' onPress={start} />
			</ScrollableScreen>
		);
	}

	return (
		<ScrollableScreen
			style={{ paddingBottom: bottom }}
			contentContainerStyle={{ backgroundColor: theme.screen.background }}
		>
			<Spacer y={16} />
			{transfer.status === 'Succeeded' ? (
				<View>
					<Typography weight='semibold' size='xlarge'>
						Payment received
					</Typography>
					<Spacer y={8} />
					<Typography variant='secondary'>
						We received {formatNaira(transfer.amount)}. Your order is confirmed.
					</Typography>
					<Spacer y={16} />
					<Button text='Done' onPress={() => navigation.goBack()} />
				</View>
			) : null}

			{transfer.status === 'Expired' ? (
				<View>
					<Typography weight='semibold' size='xlarge'>
						This account has expired
					</Typography>
					<Spacer y={8} />
					<Typography variant='secondary'>
						The transfer window closed before the payment arrived, so the order
						is still unpaid. Get a new account and send the exact amount.
					</Typography>
					<Spacer y={16} />
					<Button text='Get a new account' onPress={start} />
				</View>
			) : null}

			{transfer.status === 'Rejected' || transfer.status === 'Failed' ? (
				<View>
					<Typography weight='semibold' size='xlarge'>
						Transfer not accepted
					</Typography>
					<Spacer y={8} />
					<Typography variant='secondary'>
						This order is still unpaid. A different amount is not applied to the
						order. Try again and send {formatNaira(transfer.amount)} exactly.
					</Typography>
					<Spacer y={16} />
					<Button text='Try again' onPress={start} />
				</View>
			) : null}

			{transfer.status === 'Pending' ? (
				<View>
					<Typography variant='secondary'>Transfer exactly</Typography>
					<Spacer y={4} />
					<Typography weight='semibold' size='xlarge'>
						{formatNaira(transfer.amount)}
					</Typography>
					<Spacer y={16} />
					<Detail label='Bank' value={transfer.bankName} />
					<Spacer y={12} />
					<Typography variant='secondary'>Account number</Typography>
					<View style={styles.accountRow}>
						<Typography weight='semibold' size='large' selectable>
							{transfer.accountNumber}
						</Typography>
						<TextButton
							onPress={copyAccountNumber}
							accessibilityLabel='Copy account number'
						>
							{copied ? 'Copied' : 'Copy'}
						</TextButton>
					</View>
					<Spacer y={12} />
					<Detail label='Account name' value={transfer.accountName} />
					<Spacer y={16} />
					<Typography weight='medium'>
						{expired
							? 'Checking whether this account is still open'
							: `Expires in ${formatRemaining(remaining)}`}
					</Typography>
					<Spacer y={8} />
					<Typography variant='secondary'>
						Use this account only for this order. Send the exact amount before
						it expires. A different or late amount is not applied to the order.
					</Typography>
					<Spacer y={16} />
					<Button
						text={
							checking ? 'Checking for your transfer' : "I've sent the money"
						}
						onPress={() => setChecking(true)}
						disabled={checking}
						loading={checking}
					/>
				</View>
			) : null}
		</ScrollableScreen>
	);
};

const Detail: React.FC<{ label: string; value: string }> = ({
	label,
	value
}) => (
	<View>
		<Typography variant='secondary'>{label}</Typography>
		<Spacer y={4} />
		<Typography weight='medium' size='large'>
			{value}
		</Typography>
	</View>
);

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		paddingTop: 16
	},
	accountRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export default BankTransferScreen;
