import { Checkbox, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProductQuery, useCategoriesQuery } from '../../types/api';

interface CategoriesProps {
	categories: ProductQuery['product']['categories'];
	selectedCategories: string[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const Categories: React.FC<CategoriesProps> = ({
	selectedCategories,
	setSelectedCategories
}) => {
	const [{ data, fetching }] = useCategoriesQuery();

	const handleSelectCategory = (id: string) => {
		setSelectedCategories(prev =>
			prev.includes(id)
				? prev.filter(categoryId => categoryId !== id)
				: [...prev, id]
		);
	};

	if (fetching) return null;

	return (
		<View style={styles.container}>
			<Typography weight='medium' variant='label'>
				Categories
			</Typography>
			<Spacer y={8} />
			{data?.currentStore.categories.map(({ id, name }) => (
				<View key={id} style={styles.row}>
					<Typography>{name}</Typography>
					<Checkbox
						active={selectedCategories.includes(id)}
						onPress={() => handleSelectCategory(id)}
					/>
				</View>
			))}
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

export default Categories;
