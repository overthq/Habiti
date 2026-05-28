import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Spacer, Typography, useTheme } from '@habiti/components';

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
			name='All'
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
	const { theme } = useTheme();

	return (
		<Pressable onPress={onPress}>
			<View style={{ paddingHorizontal: 16 }}>
				<Typography
					size='small'
					weight='medium'
					variant={active ? 'primary' : 'secondary'}
				>
					{name}
				</Typography>
			</View>

			<Spacer y={8} />

			<View style={{ alignItems: 'center' }}>
				<View
					style={{
						height: 2,
						backgroundColor: active ? theme.text.primary : 'transparent',
						width: '100%'
					}}
				/>
			</View>
		</Pressable>
	);
};

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
