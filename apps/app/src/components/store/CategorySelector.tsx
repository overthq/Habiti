import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import CategorySelectorItem from './CategorySelectorItem';
import type { StoreProductCategory } from '../../data/types';

interface CategorySelectorProps {
	categories: StoreProductCategory[];
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
		paddingTop: 12
	},
	content: {
		alignItems: 'center'
	}
});

export default CategorySelector;
