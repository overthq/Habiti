import { SelectGroup } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import { useCategoriesQuery } from '../../types/api';

// TODO: This should ultimately be stored in form state.

const ProductCategories = () => {
	const [{ data, fetching }] = useCategoriesQuery();
	const [selectedCategory, setSelectedCategory] = React.useState<string>();

	if (fetching || !data) {
		return <View />;
	}

	return (
		<SelectGroup
			selected={selectedCategory}
			onSelect={setSelectedCategory}
			options={data.currentStore.categories.map(c => ({
				title: c.name,
				value: c.id
			}))}
		/>
	);
};

export default ProductCategories;
