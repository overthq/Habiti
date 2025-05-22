import {
	Screen,
	Checkbox,
	Typography,
	Button,
	Spacer
} from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	useCategoriesQuery,
	useUpdateProductCategoriesMutation
} from '../types/api';
import { ProductStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import useGoBack from '../hooks/useGoBack';

interface ProductCategoriesProps {
	productId: string;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({ productId }) => {
	const {
		params: { categories }
	} = useRoute<RouteProp<ProductStackParamList, 'Product.Categories'>>();
	const [{ data }] = useCategoriesQuery();
	const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
		categories.map(({ categoryId }) => categoryId)
	);
	const [, updateProductCategories] = useUpdateProductCategoriesMutation();
	useGoBack();

	const handleSelectCategory = (id: string) => {
		setSelectedCategories(prev =>
			prev.includes(id)
				? prev.filter(categoryId => categoryId !== id)
				: [...prev, id]
		);
	};

	const handleUpdateCategories = async () => {
		const add = selectedCategories.filter(
			id => !categories.some(category => category.categoryId === id)
		);
		const remove = categories
			.filter(category => !selectedCategories.includes(category.categoryId))
			.map(({ categoryId }) => categoryId);

		await updateProductCategories({ id: productId, input: { add, remove } });
	};

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
			<View>
				<Button text='Update Categories' onPress={handleUpdateCategories} />
				<Spacer y={8} />
			</View>
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
