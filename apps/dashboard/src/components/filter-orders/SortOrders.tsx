import { SelectGroup, Spacer } from '@market/components';
import React from 'react';
import { Controller } from 'react-hook-form';

import { FilterOrdersFormValues } from '../../types/forms';

const SortOrders = () => {
	return (
		<Controller<FilterOrdersFormValues>
			name='sortBy'
			render={({ field }) => (
				<>
					<Spacer y={8} />
					<SelectGroup
						selected={field.value as string}
						options={[
							{ title: 'Default', value: undefined },
							{ title: 'Newest to oldest', value: 'created-at-desc' },
							{ title: 'Total (highest to lowest)', value: 'total-desc' },
							{ title: 'Total (lowest to highest)', value: 'total-asc' }
						]}
						onSelect={field.onChange}
					/>
					<Spacer y={4} />
				</>
			)}
		/>
	);
};

export default SortOrders;
