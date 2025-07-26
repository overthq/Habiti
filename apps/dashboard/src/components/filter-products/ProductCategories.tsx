import { SelectGroup } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import { useCategoriesQuery } from '../../types/api';

interface ProductCategoriesProps {
	onSelectCategory: (categoryId: string) => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	onSelectCategory
}) => {
	const [{ data, fetching }] = useCategoriesQuery();
	const [selectedCategory, setSelectedCategory] = React.useState<string>();

	const handleSelectCategory = (categoryId: string) => {
		setSelectedCategory(categoryId);
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
