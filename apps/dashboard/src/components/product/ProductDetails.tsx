import { View, StyleSheet } from 'react-native';

import { Spacer, Typography, useTheme, Button } from '@habiti/components';
import { ProductQuery } from '../../types/api';
import { useNavigation } from '@react-navigation/native';
import { ProductStackParamList } from '../../types/navigation';
import { NavigationProp } from '@react-navigation/native';

interface ProductDetailsProps {
	product: ProductQuery['product'];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<ProductStackParamList>>();

	return (
		<View style={{ marginTop: 8 }}>
			<Spacer y={8} />
			<View
				style={[styles.container, { backgroundColor: theme.screen.background }]}
			>
				<Typography size='xlarge' weight='medium'>
					{product.name}
				</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>{product.description}</Typography>
				<Spacer y={8} />
				<Button
					text='Edit name and description'
					size='small'
					onPress={() =>
						navigate('Product.Details', {
							productId: product.id,
							name: product.name,
							description: product.description
						})
					}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		borderRadius: 8
	}
});

export default ProductDetails;
