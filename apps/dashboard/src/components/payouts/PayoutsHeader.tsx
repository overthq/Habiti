import React from 'react';
import { View } from 'react-native';
import { formatNaira } from '@habiti/common';
import { SectionHeader, Spacer, Typography } from '@habiti/components';

import LinkBankAccountBanner from './LinkBankAccountBanner';
import RevenueBar from './RevenueBar';
import RevenueBarLegend from './RevenueBarLegend';

interface PayoutsHeaderProps {
	hasLinkedBankAccount: boolean;
	realizedRevenue: number;
	unrealizedRevenue: number;
	paidOut: number;
	onAddPayoutAccount(): void;
}

const PayoutsHeader: React.FC<PayoutsHeaderProps> = ({
	hasLinkedBankAccount,
	realizedRevenue,
	unrealizedRevenue,
	paidOut,
	onAddPayoutAccount
}) => {
	return (
		<View style={{ paddingTop: 16 }}>
			{!hasLinkedBankAccount && (
				<LinkBankAccountBanner onAddPayoutAccount={onAddPayoutAccount} />
			)}
			<Spacer y={16} />
			<SectionHeader title='Available' padded={false} />
			<Typography size='xxxlarge' weight='bold' style={{ marginBottom: 8 }}>
				{formatNaira(realizedRevenue)}
			</Typography>
			<RevenueBar
				realizedRevenue={realizedRevenue}
				unrealizedRevenue={unrealizedRevenue}
				paidOut={paidOut}
			/>
			<Spacer y={12} />
			<RevenueBarLegend />
			<Spacer y={16} />
			<SectionHeader title='Payout History' padded={false} />
		</View>
	);
};

export default PayoutsHeader;
