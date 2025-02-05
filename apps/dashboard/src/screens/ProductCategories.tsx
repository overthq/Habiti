import { Checkbox, Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import {
	ProductQuery,
	useCategoriesQuery,
	useUpdateProductCategoriesMutation
} from '../types/api';

interface ProductCategoriesProps {
	productId: string;
	categories: ProductQuery['product']['categories'];
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	productId,
	categories
}) => {
	const [{ data }] = useCategoriesQuery();
	const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
		categories.map(({ categoryId }) => categoryId)
	);
	const [, updateProductCategories] = useUpdateProductCategoriesMutation();

	const handleSelectCategory = (id: string) => {
		setSelectedCategories(prev =>
			prev.includes(id)
				? prev.filter(categoryId => categoryId !== id)
				: [...prev, id]
		);
	};

	const handleUpdateCategories = async () => {
		const add = selectedCategories.filter(
			id => !categories.some(category => category.categoryId === id)
		);
		const remove = categories
			.filter(category => !selectedCategories.includes(category.categoryId))
			.map(({ categoryId }) => categoryId);

		await updateProductCategories({ id: productId, input: { add, remove } });
	};

	return (
		<View>
			<Typography>Product Categories</Typography>
			{data?.currentStore.categories.map(({ id, name }) => (
				<View key={id} style={styles.row}>
					<Typography>{name}</Typography>
					<Checkbox
						active={selectedCategories.includes(id)}
						onPress={() => handleSelectCategory(id)}
					/>
				</View>
			))}
			<Button title='Update Categories' onPress={handleUpdateCategories} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8
	}
});

export default ProductCategories;
