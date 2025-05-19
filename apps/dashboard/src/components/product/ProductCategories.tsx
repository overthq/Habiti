import { View } from 'react-native';

import { Spacer, TextButton, Typography, useTheme } from '@habiti/components';
import { ProductQuery } from '../../types/api';
interface ProductCategoriesProps {
	categories: ProductQuery['product']['categories'];
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
	categories
}) => {
	const { theme } = useTheme();

	return (
		<View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<Typography size='large' weight='medium' variant='label'>
					Categories
				</Typography>
				<TextButton>Manage categories</TextButton>
			</View>
			<Spacer y={8} />
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
				{categories.map(({ category }) => (
					<View
						key={category.id}
						style={{
							backgroundColor: theme.button.primary.background,
							flexDirection: 'row',
							alignItems: 'center',
							paddingHorizontal: 8,
							paddingVertical: 2,
							borderRadius: 100
						}}
					>
						<Typography variant='invert' size='small'>
							{category.name}
						</Typography>
					</View>
				))}
			</View>
		</View>
	);
};

export default ProductCategories;
