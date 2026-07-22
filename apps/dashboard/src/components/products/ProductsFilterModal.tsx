import React from 'react';
import { Pressable, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomModal, Spacer, Typography, useTheme } from '@habiti/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccordionRow from '../filter-products/AccordionRow';
import ProductCategories from '../filter-products/ProductCategories';
import SortProducts from '../filter-products/SortProducts';
import { useProductsFilterStore } from '../../state/filters';

type AccordionKey = 'sort-by' | 'category';

const ProductsFilterModal: React.FC<ProductsFilterModalProps> = ({
	modalRef,
	filters,
	onUpdateFilters,
	onClearFilters
}) => {
	const { bottom } = useSafeAreaInsets();
	const [open, setOpen] = React.useState<AccordionKey>();
	const { theme } = useTheme();
	const filters = useProductsFilterStore(state => state.filters);
	const setFilters = useProductsFilterStore(state => state.setFilters);
	const clearFilters = useProductsFilterStore(state => state.clearFilters);

	const handleExpandSection = React.useCallback(
		(key: AccordionKey) => () => {
			setOpen(o => (o === key ? undefined : key));
		},
		[]
	);

	const handleSelectCategory = (categoryId: string) => {
		setFilters({ categoryId });
	};

	const handleUpdateSortBy = React.useCallback(
		(sortBy: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc') => {
			setFilters({ sortBy });
		},
		[setFilters]
	);

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom, paddingHorizontal: 16 }}>
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
						onPress={onClearFilters}
						style={{
							paddingHorizontal: 12,
							paddingVertical: 4,
							borderWidth: 1,
							borderColor: theme.border.color,
							borderRadius: 100
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
					<SortProducts
						sortBy={filters.sortBy}
						onUpdateSortBy={handleUpdateSortBy}
					/>
				</AccordionRow>
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
