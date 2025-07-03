import React from 'react';
import { View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Spacer, Typography } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrdersContext } from './OrdersContext';
import AccordionRow from '../filter-products/AccordionRow';
import ProductCategories from '../filter-products/ProductCategories';
import SortProducts from '../filter-products/SortProducts';
import { FilterProductsFormValues } from '../../types/forms';
import { FormProvider, useForm } from 'react-hook-form';

interface OrdersFilterModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
}

type AccordionKey = 'sort-by' | 'price' | 'rating' | 'category' | 'in-stock';

const OrdersFilterModal: React.FC<OrdersFilterModalProps> = ({ modalRef }) => {
	const { bottom } = useSafeAreaInsets();
	const { status, setStatus } = useOrdersContext();
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
					<Spacer y={8} />
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
					<AccordionRow
						title='Category'
						open={open === 'category'}
						onPress={handleExpandSection('category')}
					>
						<>
							<Spacer y={8} />
							<ProductCategories />
							<Spacer y={4} />
						</>
					</AccordionRow>
				</FormProvider>
			</BottomSheetView>
		</BottomModal>
	);
};

export default OrdersFilterModal;
