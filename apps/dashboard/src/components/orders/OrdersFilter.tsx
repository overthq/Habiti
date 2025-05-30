import React from 'react';
import { useTheme, Icon, TextButton } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, Pressable, StyleSheet } from 'react-native';

import { OrderStatus } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';

interface FilterButtonProps {
	text: string;
	onPress(): void;
	active: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
	text,
	onPress,
	active
}) => (
	<TextButton size={15} active={active} onPress={onPress}>
		{text}
	</TextButton>
);

const OrdersFilter: React.FC<{
	status: OrderStatus;
	onStatusChange: (status: OrderStatus) => void;
}> = ({ status, onStatusChange }) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

	const handleChangeStatus = (status?: OrderStatus) => () => {
		onStatusChange(status);
	};

	const openFilterSheet = React.useCallback(() => {
		navigate('FilterOrders');
	}, []);

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
				<Icon name='sliders-horizontal' size={20} />
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
		paddingBottom: 12,
		paddingHorizontal: 16
	},
	left: {
		flexDirection: 'row',
		gap: 12
	}
});

export default OrdersFilter;
