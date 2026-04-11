import React from 'react';
import { View, StyleSheet } from 'react-native';
import { formatNaira } from '@habiti/common';
import {
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import RecentTransactions from '../components/store/RecentTransactions';
import { useCurrentStoreQuery } from '../data/queries';

interface BalanceRowProps {
	label: string;
	amount: number;
	isLast?: boolean;
}

const BalanceRow: React.FC<BalanceRowProps> = ({ label, amount, isLast }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.row,
				!isLast
					? {
							borderBottomWidth: StyleSheet.hairlineWidth,
							borderColor: theme.border.color
						}
					: {}
			]}
		>
			<Typography size='small'>{label}</Typography>
			<Typography size='small' weight='medium'>
				{formatNaira(amount)}
			</Typography>
		</View>
	);
};

const BalanceDetails = () => {
	const { data } = useCurrentStoreQuery();
	const { theme } = useTheme();

	if (!data?.store) {
		return <View />;
	}

	const { realizedRevenue, unrealizedRevenue, paidOut } = data.store;
	const available = (realizedRevenue ?? 0) - (paidOut ?? 0);

	return (
		<ScrollableScreen style={{ paddingHorizontal: 16 }}>
			<Spacer y={16} />

			<View style={[styles.list, { backgroundColor: theme.input.background }]}>
				<BalanceRow label='Available' amount={available} />
				<BalanceRow label='Realized revenue' amount={realizedRevenue ?? 0} />
				<BalanceRow
					label='Unrealized revenue'
					amount={unrealizedRevenue ?? 0}
					isLast
				/>
			</View>

			<Spacer y={16} />

			<RecentTransactions />
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	list: {
		borderRadius: 12,
		paddingHorizontal: 12
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12
	}
});

export default BalanceDetails;
