import React from 'react';
import { View } from 'react-native';
import { PillButton, Spacer, Typography, useTheme } from '@habiti/components';

interface LinkBankAccountBannerProps {
	onAddPayoutAccount(): void;
}

const LinkBankAccountBanner: React.FC<LinkBankAccountBannerProps> = ({
	onAddPayoutAccount
}) => {
	const { theme } = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.input.background,
				padding: 12,
				borderRadius: 6
			}}
		>
			<Typography size='small' weight='medium'>
				You haven't linked a bank account yet.
			</Typography>
			<Spacer y={8} />
			<Typography size='small'>
				A bank account is required to request payouts.
			</Typography>
			<Spacer y={12} />
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<PillButton
					text='Add bank account'
					size='small'
					onPress={onAddPayoutAccount}
				/>
				<PillButton
					text='Dismiss'
					size='small'
					variant='secondary'
					onPress={() => {}}
				/>
			</View>
		</View>
	);
};

export default LinkBankAccountBanner;
