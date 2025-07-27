import React from 'react';
import { SelectGroup, Spacer } from '@habiti/components';

interface SortOrdersProps {
	sortBy: 'created-at-desc' | 'total-desc' | 'total-asc';
	onUpdateSortBy: (
		sortBy: 'created-at-desc' | 'total-desc' | 'total-asc'
	) => void;
}

const SortOrders = ({ sortBy, onUpdateSortBy }: SortOrdersProps) => {
	return (
		<>
			<Spacer y={8} />
			<SelectGroup
				selected={sortBy}
				options={[
					{ title: 'Default', value: undefined },
					{ title: 'Newest to oldest', value: 'created-at-desc' },
					{ title: 'Total (highest to lowest)', value: 'total-desc' },
					{ title: 'Total (lowest to highest)', value: 'total-asc' }
				]}
				onSelect={onUpdateSortBy}
			/>
			<Spacer y={4} />
		</>
	);
};

export default SortOrders;
