import { Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';

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
		<View style={styles.container}>
			<ScrollView style={styles.scroll} horizontal>
				<Pressable disabled={selected === undefined}>
					<Typography
						size='large'
						weight={selected === undefined ? 'medium' : 'regular'}
						variant={selected === undefined ? 'primary' : 'secondary'}
					>
						All Products
					</Typography>
				</Pressable>
				{categories.map(({ id, name }) => (
					<Pressable
						disabled={id === selected}
						onPress={() => selectCategory(id)}
					>
						<Typography
							size='large'
							weight={id === selected ? 'medium' : 'regular'}
							variant={id === selected ? 'primary' : 'secondary'}
						>
							{name}
						</Typography>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// height: 20
		paddingTop: 16,
		paddingBottom: 8
	},
	scroll: {
		paddingLeft: 16
	}
});

export default CategorySelector;
