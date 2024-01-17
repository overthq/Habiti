import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFormContext } from 'react-hook-form';
import Typography from '../global/Typography';
import Radio from '../global/Radio';
import { Controller } from 'react-hook-form';

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

const SortProducts = () => {
	const { control, setValue } = useFormContext<FilterProductsFormValues>();

	return (
		<View style={{ marginTop: 8 }}>
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
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
		paddingRight: 2
	}
});

export default SortProducts;
