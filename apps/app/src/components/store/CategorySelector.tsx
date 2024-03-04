import { Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';

interface CategorySelectorProps {
	categories: any[];
	selected?: string;
	selectCategory(categoryId: string): void;
}

interface CategorySelectorItemProps {
	name: string;
	categoryId?: string;
	onPress(categoryId?: string): void;
	selected: boolean;
}

const CategorySelectorItem: React.FC<CategorySelectorItemProps> = ({
	name,
	categoryId
}) => {
	return (
		<Pressable style={{ marginRight: 16 }}>
			<Typography size='large'>{name}</Typography>
		</Pressable>
	);
};

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
		width: '100%',
		marginTop: 8,
		paddingVertical: 8
	},
	scroll: {
		paddingLeft: 16
	}
});

export default CategorySelector;
