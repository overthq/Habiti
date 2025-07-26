import React from 'react';
import { View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Spacer, Typography } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormProvider, useForm } from 'react-hook-form';

import AccordionRow from '../filter-products/AccordionRow';
import SortProducts from '../filter-products/SortProducts';
import { FilterProductsFormValues } from '../../types/forms';
import { OrdersStackParamList } from '../../types/navigation';

interface OrdersFilterModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	onUpdateParams: (params: OrdersStackParamList['OrdersList']) => void;
}

type AccordionKey = 'sort-by' | 'price' | 'rating' | 'category' | 'in-stock';

const OrdersFilterModal: React.FC<OrdersFilterModalProps> = ({ modalRef }) => {
	const { bottom } = useSafeAreaInsets();
	const [open, setOpen] = React.useState<AccordionKey>();
	const methods = useForm<FilterProductsFormValues>({
		defaultValues: {
			sortBy: undefined,
			minPrice: undefined,
			maxPrice: undefined,
			categories: [],
			inStock: undefined
		}
	});

	const handleExpandSection = React.useCallback(
		(key: AccordionKey) => () => {
			setOpen(o => (o === key ? undefined : key));
		},
		[]
	);

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<FormProvider {...methods}>
					<Typography weight='semibold' size='xlarge'>
						Filter
					</Typography>
					<Spacer y={12} />
					<AccordionRow
						title='Sort by'
						open={open === 'sort-by'}
						onPress={handleExpandSection('sort-by')}
					>
						<SortProducts />
					</AccordionRow>
					<AccordionRow
						title='Price'
						open={open === 'price'}
						onPress={handleExpandSection('price')}
					>
						<View />
					</AccordionRow>
				</FormProvider>
			</BottomSheetView>
		</BottomModal>
	);
};

export default OrdersFilterModal;
