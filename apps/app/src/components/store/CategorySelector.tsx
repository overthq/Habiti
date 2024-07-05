import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import CategorySelectorItem from './CategorySelectorItem';
import { StoreQuery } from '../../types/api';

interface CategorySelectorProps {
	categories: StoreQuery['store']['categories'];
	selected?: string;
	selectCategory(categoryId: string): void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	categories,
	selected,
	selectCategory
}) => (
	<ScrollView
		style={styles.container}
		horizontal
		showsHorizontalScrollIndicator={false}
		contentContainerStyle={styles.content}
	>
		<CategorySelectorItem
			name='All Products'
			active={selected === undefined}
			onPress={() => selectCategory(undefined)}
		/>
		{categories.map(({ id, name }) => (
			<CategorySelectorItem
				key={id}
				name={name}
				active={selected === id}
				onPress={() => selectCategory(id)}
			/>
		))}
	</ScrollView>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginTop: 8,
		paddingVertical: 8
	},
	content: {
		alignItems: 'center',
		paddingHorizontal: 16,
		gap: 12
	}
});

export default CategorySelector;
