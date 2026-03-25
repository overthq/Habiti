import React from 'react';
import { View } from 'react-native';
import { formatNaira } from '@habiti/common';
import {
	Screen,
	ScrollableScreen,
	SectionHeader,
	Spacer,
	Typography
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import LinkBankAccountBanner from '../components/payouts/LinkBankAccountBanner';
import RevenueBar from '../components/payouts/RevenueBar';
import RevenueBarLegend from '../components/payouts/RevenueBarLegend';

import { useCurrentStoreQuery } from '../data/queries';
import useGoBack from '../hooks/useGoBack';

import type { AppStackParamList } from '../types/navigation';

const BalanceDetails = () => {
	const { data } = useCurrentStoreQuery();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	useGoBack();

	const handleAddPayoutAccount = React.useCallback(() => {
		navigate('Modal.AddPayoutAccount');
	}, []);

	if (!data?.store) {
		return <View />;
	}

	const { realizedRevenue, unrealizedRevenue, paidOut, bankAccountNumber } =
		data.store;
	const available = (realizedRevenue ?? 0) - (paidOut ?? 0);

	return (
		<ScrollableScreen style={{ paddingHorizontal: 16 }}>
			<Spacer y={16} />

			<SectionHeader title='Available' padded={false} />

			<Typography size='xxxlarge' weight='bold' style={{ marginBottom: 8 }}>
				{formatNaira(available)}
			</Typography>

			<RevenueBar
				realizedRevenue={realizedRevenue ?? 0}
				unrealizedRevenue={unrealizedRevenue ?? 0}
				paidOut={paidOut ?? 0}
			/>

			<Spacer y={16} />

			<RevenueBarLegend />

			{!bankAccountNumber && (
				<LinkBankAccountBanner onAddPayoutAccount={handleAddPayoutAccount} />
			)}
		</ScrollableScreen>
	);
};

export default BalanceDetails;
