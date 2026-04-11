import React from 'react';
import { View } from 'react-native';
import { formatNairaAbbreviated } from '@habiti/common';
import {
	PillButton,
	SectionHeader,
	Spacer,
	Typography
} from '@habiti/components';

interface PayoutsHeaderProps {
	realizedRevenue: number;
	paidOut: number;
	onViewDetails(): void;
}

const PayoutsHeader: React.FC<PayoutsHeaderProps> = ({
	realizedRevenue,
	paidOut,
	onViewDetails
}) => {
	const available = realizedRevenue - paidOut;

	return (
		<View style={{ paddingTop: 16 }}>
			<SectionHeader title='Available' padded={false} />
			<Typography size='xxxlarge' weight='bold'>
				{formatNairaAbbreviated(available)}
			</Typography>

			<Spacer y={8} />

			<PillButton text='View details' onPress={onViewDetails} />
		</View>
	);
};

export default PayoutsHeader;
