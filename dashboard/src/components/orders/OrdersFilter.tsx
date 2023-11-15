import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { OrderStatus } from '../../types/api';
import { Icon } from '../Icon';
import useTheme from '../../hooks/useTheme';

interface FilterButtonProps {
	text: string;
	onPress(): void;
	active: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
	text,
	onPress,
	active
}) => {
	const { theme } = useTheme();

	return (
		<Pressable style={styles.button} onPress={onPress}>
			<Text
				style={[
					styles.text,
					{ color: active ? theme.text.primary : '#777777' }
				]}
			>
				{text}
			</Text>
		</Pressable>
	);
};

const OrdersFilter: React.FC = () => {
	const [status, setStatus] = React.useState<OrderStatus>();
	const { theme } = useTheme();

	const handleChangeStatus = (status?: OrderStatus) => () => {
		setStatus(status);
	};

	const openFilterSheet = () => {
		// Do something
	};

	return (
		<View style={[styles.container, { borderBottomColor: theme.border.color }]}>
			<View style={styles.left}>
				<FilterButton
					text='All'
					onPress={handleChangeStatus(undefined)}
					active={!status}
				/>
				<FilterButton
					text='Pending'
					onPress={handleChangeStatus(OrderStatus.Pending)}
					active={status === OrderStatus.Pending}
				/>
				<FilterButton
					text='Fulfilled'
					onPress={handleChangeStatus(OrderStatus.Completed)}
					active={status === OrderStatus.Completed}
				/>
				<FilterButton
					text='Cancelled'
					onPress={handleChangeStatus(OrderStatus.Cancelled)}
					active={status === OrderStatus.Cancelled}
				/>
			</View>
			<Pressable onPress={openFilterSheet}>
				<Icon name='filter' size={20} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.5,
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
