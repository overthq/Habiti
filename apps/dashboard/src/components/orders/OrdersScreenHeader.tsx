import { ScrollView, StyleSheet } from 'react-native';
import { IconButton, ScreenHeader } from '@habiti/components';

import { useOrdersContext } from './OrdersContext';
import { PillButton } from '@habiti/components';

import { OrderStatus } from '../../data/types';
import { useOrdersFilterStore } from '../../state/filters';

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
	const { filters, setFilters } = useOrdersFilterStore();

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{ marginTop: 8, marginHorizontal: -16 }}
			contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
		>
			<OrderStatusPill
				label='All'
				active={filters.status === undefined}
				onPress={() => {
					setFilters({ status: undefined });
				}}
			/>
			{ORDER_STATUSES.map(status => (
				<OrderStatusPill
					key={status.label}
					active={status.value === filters.status}
					onPress={() => {
						setFilters({ status: status.value });
					}}
					label={status.label}
				/>
			))}
		</ScrollView>
	);
};

const OrdersScreenHeader = () => {
	const { openFilterModal } = useOrdersContext();

	return (
		<ScreenHeader
			title='Orders'
			right={
				<IconButton
					name='sliders-horizontal'
					size={20}
					onPress={openFilterModal}
					style={{ marginVertical: -10, marginRight: -12 }}
				/>
			}
			hasBottomBorder
		>
			<OrderStatusPills />
		</ScreenHeader>
	);
};

export default OrdersScreenHeader;
