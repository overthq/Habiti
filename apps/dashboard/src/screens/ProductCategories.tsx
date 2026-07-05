import React from 'react';
import { Screen, Checkbox, Typography, Spacer } from '@habiti/components';
import { View, StyleSheet } from 'react-native';
import { HeaderButton } from '@react-navigation/elements';

import FAB from '../components/products/FAB';

import { useCategoriesQuery } from '../data/queries';
import { useUpdateProductCategoriesMutation } from '../data/mutations';
import type { AppStackScreenProps } from '../navigation/types';

const ProductCategories: React.FC<
	AppStackScreenProps<'Modal.EditProductCategories'>
> = ({ navigation, route }) => {
	const { productId, categories } = route.params;
	const { data } = useCategoriesQuery();
	const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
		() => categories.map(({ categoryId }) => categoryId)
	);
	const updateProductCategoriesMutation = useUpdateProductCategoriesMutation();

	const handleAddCategory = React.useCallback(() => {
		navigation.navigate('Modal.AddCategory');
	}, [navigation]);

	const disabled = React.useMemo(() => {
		const originalCategoryIds = categories
			.map(({ categoryId }) => categoryId)
			.sort();
		const currentCategoryIds = [...selectedCategories].sort();
		return (
			JSON.stringify(originalCategoryIds) === JSON.stringify(currentCategoryIds)
		);
	}, [selectedCategories, categories]);

	const handleSelectCategory = (id: string) => {
		setSelectedCategories(prev =>
			prev.includes(id)
				? prev.filter(categoryId => categoryId !== id)
				: [...prev, id]
		);
	};

	const handleUpdateCategories = React.useCallback(async () => {
		const add = selectedCategories.filter(
			id => !categories.some(category => category.categoryId === id)
		);

		const remove = categories.reduce<string[]>((ids, category) => {
			if (!selectedCategories.includes(category.categoryId)) {
				ids.push(category.categoryId);
			}
			return ids;
		}, []);

		await updateProductCategoriesMutation.mutateAsync({
			productId,
			body: { add, remove }
		});

		navigation.goBack();
	}, [
		selectedCategories,
		categories,
		updateProductCategoriesMutation,
		navigation,
		productId
	]);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderButton disabled={disabled} onPress={handleUpdateCategories}>
					<Typography>Save</Typography>
				</HeaderButton>
			)
		});
	}, [disabled, handleUpdateCategories, navigation]);

	return (
		<Screen>
			<Spacer y={16} />

			<View>
				{data?.categories.map(({ id, name }) => (
					<View key={id} style={styles.row}>
						<Typography>{name}</Typography>
						<Checkbox
							active={selectedCategories.includes(id)}
							onPress={() => handleSelectCategory(id)}
						/>
					</View>
				))}
			</View>

			<FAB onPress={handleAddCategory} text='Add Category' />
		</Screen>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
		paddingVertical: 4
	}
});

export default ProductCategories;
