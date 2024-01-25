import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import Typography from '../global/Typography';
import Radio from '../global/Radio';
import { FilterProductsFormValues } from '../../types/forms';

const SortProducts = () => {
	const { control, setValue } = useFormContext<FilterProductsFormValues>();

	return (
		<View style={styles.container}>
			<Controller
				name='sortBy'
				control={control}
				render={({ field }) => (
					<>
						<Pressable
							style={styles.option}
							onPress={() => setValue('sortBy', undefined)}
						>
							<Typography>Default</Typography>
							<Radio active={field.value === undefined} />
						</Pressable>
						<Pressable
							style={styles.option}
							onPress={() => setValue('sortBy', 'created-at-desc')}
						>
							<Typography>Newest</Typography>
							<Radio active={field.value === 'created-at-desc'} />
						</Pressable>
						<Pressable
							style={styles.option}
							onPress={() => setValue('sortBy', 'unit-price-desc')}
						>
							<Typography>Highest to lowest price</Typography>
							<Radio active={field.value === 'unit-price-desc'} />
						</Pressable>
						<Pressable
							style={styles.option}
							onPress={() => setValue('sortBy', 'unit-price-asc')}
						>
							<Typography>Lowest to highest price</Typography>
							<Radio active={field.value === 'unit-price-asc'} />
						</Pressable>
					</>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 8
	},
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
		paddingRight: 2
	}
});

export default SortProducts;
