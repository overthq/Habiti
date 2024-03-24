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
			<View style={styles.row}>
				<Typography>Subtotal</Typography>
				<Typography>{formatNaira(cart.total)}</Typography>
			</View>

			<View style={styles.row}>
				<Typography>Service Fee</Typography>
				<Typography>-</Typography>
			</View>

			<View style={styles.row}>
				<Typography>Taxes</Typography>
				<Typography>-</Typography>
			</View>
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
