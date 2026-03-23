import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacer, Typography, useTheme } from '@habiti/components';
import { OrderStatus } from '../../data/types';

interface AwaitingPickupBannerProps {
	status: OrderStatus;
}

const AwaitingPickupBanner: React.FC<AwaitingPickupBannerProps> = ({
	status
}) => {
	const { theme } = useTheme();

	if (status !== OrderStatus.ReadyForPickup) {
		return null;
	}

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.badge.warning.backgroundColor }
			]}
		>
			<Typography
				weight='semibold'
				size='small'
				style={[{ color: theme.badge.warning.color }]}
			>
				Awaiting Customer Pickup
			</Typography>
			<Spacer y={4} />
			<Typography
				size='small'
				style={[styles.description, { color: theme.badge.warning.color }]}
			>
				This order is ready and waiting for the customer to collect it. No
				further action is needed from you.
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginBottom: 16,
		padding: 12,
		borderRadius: 8
	},
	description: {
		lineHeight: 20,
		opacity: 0.8
	}
});

export default AwaitingPickupBanner;
