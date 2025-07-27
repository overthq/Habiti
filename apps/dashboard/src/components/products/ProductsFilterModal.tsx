import React from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Spacer, Typography } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccordionRow from '../filter-products/AccordionRow';
import ProductCategories from '../filter-products/ProductCategories';
import { ProductsFilters } from './ProductsContext';

interface ProductsFilterModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	filters: ProductsFilters;
	onUpdateFilters: (filters: ProductsFilters) => void;
}

type AccordionKey = 'category';

const ProductsFilterModal: React.FC<ProductsFilterModalProps> = ({
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

	const handleSelectCategory = (categoryId: string) => {
		onUpdateFilters({ categoryId });
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
				<Typography weight='semibold' size='xlarge'>
					Filter
				</Typography>
				<Spacer y={12} />
				<AccordionRow
					title='Category'
					open={open === 'category'}
					onPress={handleExpandSection('category')}
				>
					<Spacer y={8} />
					<ProductCategories
						selectedCategory={filters.categoryId}
						onSelectCategory={handleSelectCategory}
					/>
					<Spacer y={4} />
				</AccordionRow>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ProductsFilterModal;
