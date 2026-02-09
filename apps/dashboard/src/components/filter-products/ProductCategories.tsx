import React from 'react';
import { View } from 'react-native';
import { SelectGroup } from '@habiti/components';

import { useCategoriesQuery } from '../../data/queries';

interface ProductCategoriesProps {
	selectedCategory?: string;
	onSelectCategory: (categoryId: string) => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	selectedCategory,
	onSelectCategory
}) => {
	const { data, isLoading } = useCategoriesQuery();

	const handleSelectCategory = (categoryId: string) => {
		onSelectCategory(categoryId);
	};

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<SelectGroup
			selected={selectedCategory}
			onSelect={handleSelectCategory}
			options={data.categories.map(c => ({
				title: c.name,
				value: c.id
			}))}
		/>
	);
};

export default ProductCategories;
