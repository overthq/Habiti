import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import Animated, { Layout } from 'react-native-reanimated';
import Button from '../components/global/Button';
import useGoBack from '../hooks/useGoBack';
import AccordionRow from '../components/filter-products/AccordionRow';
import SortProducts from '../components/filter-products/SortProducts';
import Checkbox from '../components/global/Checkbox';
import Screen from '../components/global/Screen';
import Typography from '../components/global/Typography';
import { ProductsStackParamList } from '../types/navigation';
import { Sort } from '../types/api';

type AccordionKey = 'sort-by' | 'price' | 'rating' | 'category' | 'in-stock';

interface FilterProductsFormValues {
	sortBy?: CreatedAtSortBy | UpdatedAtSortBy | UnitPriceSortBy;
	minPrice?: number;
	maxPrice?: number;
	categories: string[];
	inStock?: boolean;
}

type CreatedAtSortBy = 'created-at-asc' | 'created-at-desc';
type UpdatedAtSortBy = 'updated-at-asc' | 'updated-at-desc';
type UnitPriceSortBy = 'unit-price-asc' | 'unit-price-desc';

const buildFilterQuery = (values: FilterProductsFormValues) => {
	const { sortBy, minPrice, maxPrice } = values;

	const filter = {
		...(minPrice || maxPrice
			? { unitPrice: { gte: minPrice, lte: maxPrice } }
			: {})
	};

	let orderBy = undefined;

	// FIXME: I only just realized this means we only allow sorting
	// by a singular parameter. We should change that.

	if (!!sortBy) {
		orderBy = [];

		switch (sortBy) {
			case 'created-at-asc':
				orderBy.push({ createdAt: Sort.Asc });
				break;
			case 'created-at-desc':
				orderBy.push({ createdAt: Sort.Desc });
				break;
			case 'updated-at-asc':
				orderBy.push({ updatedAt: Sort.Asc });
				break;
			case 'updated-at-desc':
				orderBy.push({ updatedAt: Sort.Desc });
				break;
			case 'unit-price-asc':
				orderBy.push({ unitPrice: Sort.Asc });
				break;
			case 'unit-price-desc':
				orderBy.push({ unitPrice: Sort.Desc });
				break;
		}
	}

	return { filter, orderBy };
};

const FilterProducts = () => {
	const [open, setOpen] = React.useState<AccordionKey>();
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	useGoBack('x');

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

	const handleClearFilters = React.useCallback(() => {
		methods.reset();
	}, []);

	const onSubmit = React.useCallback((values: FilterProductsFormValues) => {
		navigate('ProductsList', buildFilterQuery(values));
	}, []);

	return (
		<FormProvider {...methods}>
			<Screen style={styles.container}>
				<View>
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
						title='Rating'
						open={open === 'rating'}
						onPress={handleExpandSection('rating')}
					>
						<View />
					</AccordionRow>
					<AccordionRow
						title='Category'
						open={open === 'category'}
						onPress={handleExpandSection('category')}
					>
						<View />
					</AccordionRow>
					<Animated.View layout={Layout} style={{ marginBottom: 8 }}>
						<View style={styles.row}>
							<Typography>In Stock</Typography>
							<Checkbox />
						</View>
					</Animated.View>
				</View>
				<View
					style={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 16 }}
				>
					<Button
						style={styles.button}
						text='Clear filters'
						onPress={handleClearFilters}
					/>
					<Button
						style={styles.button}
						text='Apply'
						onPress={methods.handleSubmit(onSubmit)}
					/>
				</View>
			</Screen>
		</FormProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		justifyContent: 'space-between'
	},
	button: {
		marginTop: 8
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default FilterProducts;
