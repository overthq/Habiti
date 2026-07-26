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
import { useCategoriesQuery } from '../data/queries';
import { useProductsFilterStore, ProductsFilters } from '../state/filters';

type AccordionKey = 'sort-by' | 'category';

const ProductsFilterModal = () => {
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
		(sortBy: ProductsFilters['sortBy']) => {
			setFilters({ sortBy });
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
		</SheetView>
	);
};

interface SortProductsProps {
	sortBy?: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc';
	onUpdateSortBy: (
		sortBy: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc'
	) => void;
}

const SortProducts = ({ sortBy, onUpdateSortBy }: SortProductsProps) => {
	return (
		<>
			<Spacer y={8} />
			<SelectGroup
				selected={sortBy}
				options={[
					{ title: 'Default', value: undefined },
					{ title: 'Newest to oldest', value: 'created-at-desc' },
					{ title: 'Highest to lowest price', value: 'unit-price-desc' },
					{ title: 'Lowest to highest price', value: 'unit-price-asc' }
				]}
				onSelect={onUpdateSortBy}
			/>
			<Spacer y={4} />
		</>
	);
};

interface ProductCategoriesProps {
	selectedCategory?: string;
	onSelectCategory: (categoryId: string) => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	selectedCategory,
	onSelectCategory
}) => {
	const { data, isLoading } = useCategoriesQuery();

	const handleSelectCategory = (categoryId: string) => {
		onSelectCategory(categoryId);
	};

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<SelectGroup
			selected={selectedCategory}
			onSelect={handleSelectCategory}
			options={data.categories.map(c => ({
				title: c.name,
				value: c.id
			}))}
		/>
	);
};

export default ProductsFilterModal;
