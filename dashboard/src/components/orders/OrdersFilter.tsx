import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { OrderStatus } from '../../types/api';
import { Icon } from '../Icon';

interface OrdersFilterButtonProps {
	text: string;
	onPress(): void;
	active: boolean;
}

const OrdersFilterButton: React.FC<OrdersFilterButtonProps> = ({
	text,
	onPress,
	active
}) => {
	return (
		<Pressable style={styles.button} onPress={onPress}>
			<Text style={[styles.text, { color: active ? '#000000' : '#777777' }]}>
				{text}
			</Text>
		</Pressable>
	);
};

const OrdersFilter: React.FC = () => {
	const [status, setStatus] = React.useState<OrderStatus>();

	const handleChangeStatus = (status?: OrderStatus) => () => {
		setStatus(status);
	};

	const openFilterSheet = () => {
		// Do something
	};

	return (
		<View style={styles.container}>
			<View style={styles.left}>
				<OrdersFilterButton
					text='All'
					onPress={handleChangeStatus(undefined)}
					active={!status}
				/>
				<OrdersFilterButton
					text='Pending'
					onPress={handleChangeStatus(OrderStatus.Pending)}
					active={status === OrderStatus.Pending}
				/>
				<OrdersFilterButton
					text='Fulfilled'
					onPress={handleChangeStatus(OrderStatus.Completed)}
					active={status === OrderStatus.Completed}
				/>
				<OrdersFilterButton
					text='Cancelled'
					onPress={handleChangeStatus(OrderStatus.Cancelled)}
					active={status === OrderStatus.Cancelled}
				/>
			</View>
			<Pressable onPress={openFilterSheet}>
				<Icon name='filter' size={22} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#E3E3E3',
		paddingVertical: 12,
		paddingHorizontal: 16
	},
	left: {
		flexDirection: 'row'
	},
	button: {
		marginRight: 16
	},
	text: {
		fontSize: 16
	}
});

export default OrdersFilter;
