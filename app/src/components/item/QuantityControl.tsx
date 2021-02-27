import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../icons';

interface QuantityControlProps {
	itemId: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ itemId }) => {
	const [quantity, setQuantity] = React.useState(0);
	// const dispatch = useDispatch();
	// TODO: Iron out logic around whether or not the item is in the cart.

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Quantity</Text>
			<View style={styles.controls}>
				<TouchableOpacity
					style={{ marginRight: 7.5 }}
					onPress={() => {
						if (quantity !== 0) setQuantity(quantity - 1);
					}}
				>
					<Icon name='minus' color='#828282' />
				</TouchableOpacity>
				<Text style={styles.quantity}>{quantity}</Text>
				<TouchableOpacity
					style={{ marginLeft: 7.5 }}
					onPress={() => setQuantity(quantity + 1)}
				>
					<Icon name='plus' color='#828282' />
				</TouchableOpacity>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 4
	},
	title: {
		fontSize: 16,
		fontWeight: '500'
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	quantity: {
		fontSize: 16,
		fontVariant: ['tabular-nums']
	}
});

export default QuantityControl;
