import React from 'react';
import { SheetView, Spacer, Typography, useTheme } from '@habiti/components';

import AccordionRow from '../filter-products/AccordionRow';
import SortOrders from '../filter-orders/SortOrders';
import FilterOrdersByStatus from '../filter-orders/FilterOrdersByStatus';
import { OrderStatus } from '../../data/types';
import { Pressable, View } from 'react-native';
import { useOrdersFilterStore } from '../../state/filters';

type AccordionKey = 'sort-by' | 'status';

const OrdersFilterModal = () => {
	const [open, setOpen] = React.useState<AccordionKey>();
	const { theme } = useTheme();
	const filters = useOrdersFilterStore(state => state.filters);
	const setFilters = useOrdersFilterStore(state => state.setFilters);
	const clearFilters = useOrdersFilterStore(state => state.clearFilters);

	const handleExpandSection = React.useCallback(
		(key: AccordionKey) => () => {
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

export default OrdersFilterModal;
