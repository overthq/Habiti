import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

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
	<View style={styles.container}>
		<ScrollView style={styles.scroll} horizontal>
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
	</View>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginTop: 8,
		paddingVertical: 8
	},
	scroll: {
		paddingLeft: 16
	}
});

export default CategorySelector;
