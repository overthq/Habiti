import React from 'react';
import { View, Text } from 'react-native';
import { OrderQuery } from '../../types/api';

interface OrderItemProps {
	orderItem: OrderQuery['orders'][-1]['order_items'][-1];
}

const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
	const { item, quantity, unit_price } = orderItem;

	const totalPrice = unit_price ? quantity * unit_price : 0;

	return (
		<View>
			<View
				style={{
					height: 50,
					width: 50,
					backgroundColor: '#D3D3D3',
					borderRadius: 4
				}}
			/>
			<Text>{item.name}</Text>
			<Text>
				{quantity} - N{totalPrice}
			</Text>
		</View>
	);
};

export default OrderItem;
