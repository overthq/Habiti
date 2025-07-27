import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Spacer, Typography } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AccordionRow from '../filter-products/AccordionRow';
import { OrdersFilters } from './OrdersContext';
import SortOrders from '../filter-orders/SortOrders';

interface OrdersFilterModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	filters: OrdersFilters;
	onUpdateFilters: (filters: OrdersFilters) => void;
}

type AccordionKey = 'sort-by' | 'price';

const OrdersFilterModal: React.FC<OrdersFilterModalProps> = ({
	modalRef,
	filters,
	onUpdateFilters
}) => {
	const { bottom } = useSafeAreaInsets();
	const [open, setOpen] = React.useState<AccordionKey>();

	const handleExpandSection = React.useCallback(
		(key: AccordionKey) => () => {
			setOpen(o => (o === key ? undefined : key));
		},
		[]
	);

	const handleUpdateSortBy = React.useCallback(
		(sortBy: 'created-at-desc' | 'total-desc' | 'total-asc') => {
			onUpdateFilters({ sortBy });
		},
		[onUpdateFilters]
	);

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<Typography weight='semibold' size='xlarge'>
					Filter
				</Typography>
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
			</BottomSheetView>
		</BottomModal>
	);
};

export default OrdersFilterModal;
