import { SelectGroup, Spacer } from '@market/components';
import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { FilterProductsFormValues } from '../../types/forms';

const SortProducts = () => {
	return (
		<Controller<FilterProductsFormValues>
			name='sortBy'
			render={({ field }) => (
				<>
					<Spacer y={8} />
					<SelectGroup
						selected={field.value as string}
						options={[
							{
								title: 'Default',
								value: undefined
							},
							{
								title: 'Newest to oldest',
								value: 'created-at-desc'
							},
							{
								title: 'Highest to lowest price',
								value: 'unit-price-desc'
							},
							{
								title: 'Lowest to highest price',
								value: 'unit-price-asc'
							}
						]}
						onSelect={field.onChange}
					/>
					<Spacer y={4} />
				</>
			)}
		/>
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
