import { View } from 'react-native';

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
		<View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<Typography size='large' weight='medium'>
					Categories
				</Typography>
				<TextButton
					weight='medium'
					onPress={() =>
						navigate('Product.Categories', { productId, categories })
					}
				>
					Update
				</TextButton>
			</View>
			<Spacer y={8} />
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
				{categories.map(({ category }) => (
					<View
						key={category.id}
						style={{
							backgroundColor: theme.button.disabled.background,
							flexDirection: 'row',
							alignItems: 'center',
							paddingHorizontal: 8,
							paddingVertical: 2,
							borderRadius: 100
						}}
					>
						<Typography variant='primary' size='small'>
							{category.name}
						</Typography>
					</View>
				))}
			</View>
		</View>
	);
};

export default ProductCategories;
