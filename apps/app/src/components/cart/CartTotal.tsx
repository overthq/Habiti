import { formatNaira } from '@habiti/common';
import { Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CartQuery } from '../../types/api';
import { calculateFees } from '../../utils/fees';

interface CartTotalProps {
	cart: CartQuery['cart'];
	fees: ReturnType<typeof calculateFees>;
}

const CartTotal: React.FC<CartTotalProps> = ({ cart, fees }) => {
	return (
		<View style={{ paddingHorizontal: 16 }}>
			<CartTotalRow title='Subtotal' value={formatNaira(cart.total)} />
			<CartTotalRow
				title='Transaction Fee'
				value={formatNaira(fees.transaction)}
			/>
			<CartTotalRow title='Service Fee' value={formatNaira(fees.service)} />
			<CartTotalRow
				title='Total'
				value={formatNaira(fees.total + cart.total)}
				total
			/>
		</View>
	);
};

interface CartTotalRowProps {
	title: string;
	value: string;
	total?: boolean;
}

const CartTotalRow: React.FC<CartTotalRowProps> = ({ title, value, total }) => {
	return (
		<View style={styles.row}>
			<Typography
				variant={total ? 'primary' : 'secondary'}
				weight={total ? 'medium' : 'regular'}
			>
				{title}
			</Typography>
			<Typography
				variant={total ? 'primary' : 'secondary'}
				weight={total ? 'medium' : 'regular'}
			>
				{value}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8
	}
});

export default CartTotal;
