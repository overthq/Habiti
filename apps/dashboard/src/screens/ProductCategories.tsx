import React from 'react';
import { Screen, Checkbox, Typography, TextButton } from '@habiti/components';
import { View, StyleSheet } from 'react-native';
import { useCategoriesQuery } from '../data/queries';
import { useUpdateProductCategoriesMutation } from '../data/mutations';
import { AppStackParamList, ProductStackParamList } from '../types/navigation';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import useGoBack from '../hooks/useGoBack';
import FAB from '../components/products/FAB';

const ProductCategories: React.FC = () => {
	const {
		params: { productId, categories }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Categories'>>();
	const { navigate, goBack, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const { data } = useCategoriesQuery();
	const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
		categories.map(({ categoryId }) => categoryId)
	);
	const updateProductCategoriesMutation = useUpdateProductCategoriesMutation();
	useGoBack();

	const handleAddCategory = React.useCallback(() => {
		navigate('AddCategory');
	}, [navigate]);

	const disabled = React.useMemo(() => {
		const originalCategoryIds = categories
			.map(({ categoryId }) => categoryId)
			.sort();
		const currentCategoryIds = [...selectedCategories].sort();
		return (
			JSON.stringify(originalCategoryIds) === JSON.stringify(currentCategoryIds)
		);
	}, [selectedCategories]);

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

		const remove = categories
			.filter(category => !selectedCategories.includes(category.categoryId))
			.map(({ categoryId }) => categoryId);

		await updateProductCategoriesMutation.mutateAsync({
			productId,
			body: { add, remove }
		});

		goBack();
	}, [
		selectedCategories,
		categories,
		updateProductCategoriesMutation,
		goBack,
		productId
	]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<TextButton disabled={disabled} onPress={handleUpdateCategories}>
					Save
				</TextButton>
			)
		});
	}, [disabled, handleUpdateCategories]);

	return (
		<Screen style={styles.container}>
			<View style={{ flex: 1 }}>
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
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
		paddingVertical: 4
	}
});

export default ProductCategories;
