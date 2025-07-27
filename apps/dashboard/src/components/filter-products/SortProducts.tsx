import React from 'react';
import { SelectGroup, Spacer } from '@habiti/components';

interface SortProductsProps {
	sortBy: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc';
	onUpdateSortBy: (
		sortBy: 'created-at-desc' | 'unit-price-desc' | 'unit-price-asc'
	) => void;
}

const SortProducts = ({ sortBy, onUpdateSortBy }: SortProductsProps) => {
	return (
		<>
			<Spacer y={8} />
			<SelectGroup
				selected={sortBy}
				options={[
					{ title: 'Default', value: undefined },
					{ title: 'Newest to oldest', value: 'created-at-desc' },
					{ title: 'Highest to lowest price', value: 'unit-price-desc' },
					{ title: 'Lowest to highest price', value: 'unit-price-asc' }
				]}
				onSelect={onUpdateSortBy}
			/>
			<Spacer y={4} />
		</>
	);
};

export default SortProducts;
