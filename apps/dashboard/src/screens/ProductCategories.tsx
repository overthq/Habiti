import React from 'react';
import { Screen, Checkbox, Typography, TextButton } from '@habiti/components';
import { View, StyleSheet } from 'react-native';
import {
	useCategoriesQuery,
	useUpdateProductCategoriesMutation
} from '../types/api';
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
	const [{ data }] = useCategoriesQuery();
	const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
		categories.map(({ categoryId }) => categoryId)
	);
	const [, updateProductCategories] = useUpdateProductCategoriesMutation();
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

		const { error } = await updateProductCategories({
			id: productId,
			input: { add, remove }
		});

		if (error) {
			console.log(error);
		} else {
			goBack();
		}
	}, [
		selectedCategories,
		categories,
		updateProductCategories,
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
				{data?.currentStore.categories.map(({ id, name }) => (
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
