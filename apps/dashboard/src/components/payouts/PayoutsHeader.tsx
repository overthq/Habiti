import React from 'react';
import { Pressable, View } from 'react-native';
import { formatNaira } from '@habiti/common';
import { Icon, SectionHeader, Spacer, Typography } from '@habiti/components';

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
			<Pressable
				onPress={onViewDetails}
				style={{ flexDirection: 'row', alignItems: 'center' }}
			>
				<Typography size='xxxlarge' weight='bold'>
					{formatNaira(available)}
				</Typography>
				<Spacer x={4} />
				<Icon name='chevron-right' size={20} />
			</Pressable>
		</View>
	);
};

export default PayoutsHeader;
