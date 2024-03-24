import { Typography } from '@market/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CartQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface CartTotalProps {
	cart: CartQuery['cart'];
}

const CartTotal: React.FC<CartTotalProps> = ({ cart }) => {
	return (
		<View style={{ paddingHorizontal: 16 }}>
			<CartTotalRow title='Subtotal' value={formatNaira(cart.total)} />
			<CartTotalRow title='Service Fee' value='-' />
			<CartTotalRow title='Taxes' value='-' />
		</View>
	);
};

interface CartTotalRowProps {
	title: string;
	value: string;
}

const CartTotalRow: React.FC<CartTotalRowProps> = ({ title, value }) => {
	return (
		<View style={styles.row}>
			<Typography>{title}</Typography>
			<Typography>{value}</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4
	}
});

export default CartTotal;
