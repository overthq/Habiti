import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import Screen from '../components/global/Screen';
import useGoBack from '../hooks/useGoBack';
import AccordionRow from '../components/filter-products/AccordionRow';
import SortOrders from '../components/filter-orders/SortOrders';
import Button from '../components/global/Button';
import { OrdersStackParamList } from '../types/navigation';
import { FilterOrdersFormValues } from '../types/forms';
import { buildOrdersFilterQuery } from '../utils/filters';

type OrderAccordionKey = 'sort-by' | 'total';

const FilterOrders = () => {
	const [open, setOpen] = React.useState<OrderAccordionKey>();
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();
	useGoBack('x');

	const methods = useForm({
		defaultValues: {
			sortBy: undefined
		}
	});

	const handleClearFilters = React.useCallback(() => {
		methods.reset();
	}, []);

	const handleExpandSection = React.useCallback(
		(key: OrderAccordionKey) => () => {
			setOpen(o => (o === key ? undefined : key));
		},
		[]
	);

	const onSubmit = React.useCallback((values: FilterOrdersFormValues) => {
		navigate('OrdersList', buildOrdersFilterQuery(values));
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
						<SortOrders />
					</AccordionRow>
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
	footer: {
		flexGrow: 1,
		justifyContent: 'flex-end',
		paddingBottom: 16
	},
	button: {
		marginTop: 8
	}
});

export default FilterOrders;
