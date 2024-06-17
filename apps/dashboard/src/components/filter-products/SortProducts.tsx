import { SelectGroup, Spacer } from '@habiti/components';
import React from 'react';
import { Controller } from 'react-hook-form';

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
							{ title: 'Default', value: undefined },
							{ title: 'Newest to oldest', value: 'created-at-desc' },
							{ title: 'Highest to lowest price', value: 'unit-price-desc' },
							{ title: 'Lowest to highest price', value: 'unit-price-asc' }
						]}
						onSelect={field.onChange}
					/>
					<Spacer y={4} />
				</>
			)}
		/>
	);
};

export default SortProducts;
