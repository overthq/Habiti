import { View, StyleSheet } from 'react-native';

import { Spacer, TextButton, Typography, useTheme } from '@habiti/components';
import { ProductQuery } from '../../types/api';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProductStackParamList } from '../../types/navigation';

interface ProductCategoriesProps {
	categories: ProductQuery['product']['categories'];
	productId: string;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	categories,
	productId
}) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<ProductStackParamList>>();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Typography size='large' weight='semibold'>
					Categories
				</Typography>
				<TextButton
					variant='secondary'
					onPress={() =>
						navigate('Product.Categories', { productId, categories })
					}
					size={15}
				>
					Update
				</TextButton>
			</View>
			<Spacer y={8} />
			<View style={styles.chips}>
				{categories.map(({ category }) => (
					<View
						key={category.id}
						style={[
							styles.chip,
							{ backgroundColor: theme.button.disabled.background }
						]}
					>
						<Typography variant='primary' weight='medium' size='small'>
							{category.name}
						</Typography>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	chip: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 100
	},
	chips: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6
	}
});

export default ProductCategories;
