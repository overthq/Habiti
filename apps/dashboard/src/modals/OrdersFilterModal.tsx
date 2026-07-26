import React from 'react';
import { Pressable, View } from 'react-native';
import {
	SelectGroup,
	SheetView,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';

import AccordionRow from '../components/AccordionRow';
import { OrderStatus } from '../data/types';
import { useOrdersFilterStore } from '../state/filters';

type FilterAccordionKey = 'sort-by' | 'status';

const OrdersFilterModal = () => {
	const [open, setOpen] = React.useState<FilterAccordionKey>();
	const { theme } = useTheme();
	const filters = useOrdersFilterStore(state => state.filters);
	const setFilters = useOrdersFilterStore(state => state.setFilters);
	const clearFilters = useOrdersFilterStore(state => state.clearFilters);

	const handleExpandSection = React.useCallback(
		(key: FilterAccordionKey) => () => {
			setOpen(o => (o === key ? undefined : key));
		},
		[]
	);

	const handleUpdateSortBy = React.useCallback(
		(sortBy: 'created-at-desc' | 'total-desc' | 'total-asc') => {
			setFilters({ sortBy });
		},
		[setFilters]
	);

	const handleSelectStatus = React.useCallback(
		(status: OrderStatus | undefined) => {
			setFilters({ status });
		},
		[setFilters]
	);

	return (
		<SheetView style={{ paddingHorizontal: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<Typography weight='semibold' size='xlarge'>
					Filter
				</Typography>
				<Pressable
					onPress={clearFilters}
					style={{
						paddingHorizontal: 12,
						paddingVertical: 4,
						borderRadius: 100,
						borderWidth: 1,
						borderColor: theme.border.color
					}}
				>
					<Typography size='small'>Clear</Typography>
				</Pressable>
			</View>
			<Spacer y={12} />
			<AccordionRow
				title='Sort by'
				open={open === 'sort-by'}
				onPress={handleExpandSection('sort-by')}
			>
				<SortOrders
					sortBy={filters.sortBy}
					onUpdateSortBy={handleUpdateSortBy}
				/>
			</AccordionRow>
			<AccordionRow
				title='Status'
				open={open === 'status'}
				onPress={handleExpandSection('status')}
			>
				<FilterOrdersByStatus
					selectedStatus={filters.status}
					onSelectStatus={handleSelectStatus}
				/>
			</AccordionRow>
		</SheetView>
	);
};

interface SortOrdersProps {
	sortBy?: 'created-at-desc' | 'total-desc' | 'total-asc';
	onUpdateSortBy: (
		sortBy: 'created-at-desc' | 'total-desc' | 'total-asc'
	) => void;
}

const SortOrders = ({ sortBy, onUpdateSortBy }: SortOrdersProps) => {
	return (
		<>
			<Spacer y={8} />
			<SelectGroup
				selected={sortBy}
				options={[
					{ title: 'Default', value: undefined },
					{ title: 'Newest to oldest', value: 'created-at-desc' },
					{ title: 'Total (highest to lowest)', value: 'total-desc' },
					{ title: 'Total (lowest to highest)', value: 'total-asc' }
				]}
				onSelect={onUpdateSortBy}
			/>
			<Spacer y={4} />
		</>
	);
};

interface FilterOrdersByStatusProps {
	selectedStatus?: OrderStatus;
	onSelectStatus: (status: OrderStatus | undefined) => void;
}

const FilterOrdersByStatus = ({
	selectedStatus,
	onSelectStatus
}: FilterOrdersByStatusProps) => {
	return (
		<>
			<Spacer y={8} />
			<SelectGroup
				selected={selectedStatus}
				options={[
					{ title: 'All', value: undefined },
					{ title: 'Pending', value: OrderStatus.Pending },
					{ title: 'Ready for Pickup', value: OrderStatus.ReadyForPickup },
					{ title: 'Completed', value: OrderStatus.Completed },
					{ title: 'Cancelled', value: OrderStatus.Cancelled }
				]}
				onSelect={onSelectStatus}
			/>
			<Spacer y={4} />
		</>
	);
};

export default OrdersFilterModal;
