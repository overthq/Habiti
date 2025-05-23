import {
	Button,
	Checkbox,
	Screen,
	Spacer,
	Typography
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import AccordionRow from '../components/filter-products/AccordionRow';
import ProductCategories from '../components/filter-products/ProductCategories';
import SortProducts from '../components/filter-products/SortProducts';
import useGoBack from '../hooks/useGoBack';
import { FilterProductsFormValues } from '../types/forms';
import { ProductsStackParamList } from '../types/navigation';
import { buildProductsFilterQuery } from '../utils/filters';

type AccordionKey = 'sort-by' | 'price' | 'rating' | 'category' | 'in-stock';

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
		navigate('ProductsList', buildProductsFilterQuery(values));
	}, []);

	return (
		<FormProvider {...methods}>
			<Screen style={styles.container}>
				<View style={{ flex: 1 }}>
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
					{/* <AccordionRow
						title='Rating'
						open={open === 'rating'}
						onPress={handleExpandSection('rating')}
					>
						<>
							<Spacer y={8} />
							<SelectGroup
								selected={undefined}
								onSelect={value => console.log(value)}
								options={[
									{ title: '5 stars', value: '5' },
									{ title: '4 stars and up', value: '4' },
									{ title: '3 stars and up', value: '3' },
									{ title: '2 stars and up', value: '2' },
									{ title: '1 star and up', value: '1' }
								]}
							/>
							<Spacer y={4} />
						</>
					</AccordionRow> */}
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
					<Animated.View layout={LinearTransition} style={{ marginBottom: 8 }}>
						<View style={styles.row}>
							<Typography>In Stock</Typography>
							<Controller
								control={methods.control}
								name='inStock'
								render={({ field: { value, onChange } }) => (
									<Checkbox active={value} onPress={onChange} />
								)}
							/>
						</View>
					</Animated.View>
				</View>
				<View style={styles.footer}>
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
		flex: 1
	},
	row: {
		marginTop: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingRight: 8
	},
	footer: {
		paddingBottom: 16,
		flexDirection: 'row',
		gap: 12
	}
});

export default FilterProducts;
