import { Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { OrderStatus } from '../../types/api';

interface OrderStatusPillProps {
	status: OrderStatus;
}

const OrderStatusPill: React.FC<OrderStatusPillProps> = ({ status }) => {
	return (
		<View style={styles.container}>
			<Typography
				size='xsmall'
				weight='medium'
				variant='tertiary'
				style={{ lineHeight: 16 }}
			>
				{status}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignSelf: 'flex-start',
		paddingVertical: 2,
		paddingHorizontal: 8,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#D3D3D3',
		marginLeft: 16
	}
});

export default OrderStatusPill;
