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
	onPress(): void;
	active: boolean;
}

const CategorySelectorItem: React.FC<CategorySelectorItemProps> = ({
	name,
	onPress,
	active
}) => {
	return (
		<Pressable onPress={onPress} disabled={active} style={{ marginRight: 8 }}>
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
