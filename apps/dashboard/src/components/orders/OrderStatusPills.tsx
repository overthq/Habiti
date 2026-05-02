import { ScrollView, StyleSheet } from 'react-native';
import { PillButton } from '@habiti/components';

import { useOrdersContext } from './OrdersContext';

import { OrderStatus } from '../../data/types';

const ORDER_STATUSES = [
	{
		label: 'Pending',
		value: OrderStatus.Pending
	},
	{
		label: 'Ready for pickup',
		value: OrderStatus.ReadyForPickup
	},
	{
		label: 'Completed',
		value: OrderStatus.Completed
	},
	{
		label: 'Cancelled',
		value: OrderStatus.Cancelled
	}
];

interface OrderStatusPillProps {
	active: boolean;
	label: string;
	onPress(): void;
}

const OrderStatusPill: React.FC<OrderStatusPillProps> = ({
	label,
	active,
	onPress
}) => {
	return (
		<PillButton
			size='small'
			style={styles.pill}
			variant={active ? 'primary' : 'secondary'}
			onPress={onPress}
			text={label}
		/>
	);
};

const styles = StyleSheet.create({
	pill: {
		paddingHorizontal: 12,
		paddingVertical: 4
	}
});

const OrderStatusPills = () => {
	const { status: selectedStatus, setStatus } = useOrdersContext();

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{ marginTop: 8, marginHorizontal: -16 }}
			contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
		>
			<OrderStatusPill
				label='All'
				active={selectedStatus === undefined}
				onPress={() => {
					setStatus(undefined);
				}}
			/>
			{ORDER_STATUSES.map(status => (
				<OrderStatusPill
					key={status.label}
					active={status.value === selectedStatus}
					onPress={() => {
						setStatus(status.value);
					}}
					label={status.label}
				/>
			))}
		</ScrollView>
	);
};

export default OrderStatusPills;
