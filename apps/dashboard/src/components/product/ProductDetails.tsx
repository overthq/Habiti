import { View, StyleSheet } from 'react-native';

import { Spacer, Typography, useTheme } from '@habiti/components';
import { ProductQuery } from '../../types/api';

interface ProductDetailsProps {
	product: ProductQuery['product'];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.screen.background }]}
		>
			<Typography size='xxlarge' weight='semibold'>
				{product.name}
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>{product.description}</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16
	}
});

export default ProductDetails;
