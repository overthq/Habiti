import React from 'react';
import { View } from 'react-native';
import { SelectGroup } from '@habiti/components';

import { useCategoriesQuery } from '../../types/api';

interface ProductCategoriesProps {
	selectedCategory?: string;
	onSelectCategory: (categoryId: string) => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	selectedCategory,
	onSelectCategory
}) => {
	const [{ data, fetching }] = useCategoriesQuery();

	const handleSelectCategory = (categoryId: string) => {
		onSelectCategory(categoryId);
	};

	if (fetching || !data) {
		return <View />;
	}

	return (
		<SelectGroup
			selected={selectedCategory}
			onSelect={handleSelectCategory}
			options={data.currentStore.categories.map(c => ({
				title: c.name,
				value: c.id
			}))}
		/>
	);
};

export default ProductCategories;
