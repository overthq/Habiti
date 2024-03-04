import { Typography } from '@market/components';
import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';

interface CategorySelectorProps {
	categories: any[];
	selected?: string;
	selectCategory(categoryId: string): void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	categories,
	selected,
	selectCategory
}) => {
	return (
		<View style={{ height: 20 }}>
			<ScrollView style={{ height: 20 }} horizontal>
				<Pressable disabled={selected === undefined}>
					<Typography>All</Typography>
				</Pressable>
				{categories.map(({ id, name }) => (
					<Pressable onPress={() => selectCategory(id)}>
						<Typography variant={id === selected ? 'primary' : 'secondary'}>
							{name}
						</Typography>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);
};

export default CategorySelector;
