import React from 'react';
import { StyleSheet } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import Screen from '../components/global/Screen';
import useGoBack from '../hooks/useGoBack';
import AccordionRow from '../components/filter-products/AccordionRow';
import SortOrders from '../components/filter-orders/SortOrders';

type OrderAccordionKey = 'sort-by' | 'total';

const FilterOrders = () => {
	const [open, setOpen] = React.useState<OrderAccordionKey>();
	const methods = useForm();

	useGoBack('x');

	const handleExpandSection = React.useCallback(
		(key: OrderAccordionKey) => () => {
			setOpen(o => (o === key ? undefined : key));
		},
		[]
	);

	return (
		<FormProvider {...methods}>
			<Screen style={styles.container}>
				<AccordionRow
					title='Sort by'
					open={open === 'sort-by'}
					onPress={handleExpandSection('sort-by')}
				>
					<SortOrders />
				</AccordionRow>
			</Screen>
		</FormProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default FilterOrders;
