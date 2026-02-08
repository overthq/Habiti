import { View, StyleSheet } from 'react-native';

import { Spacer, Typography } from '@habiti/components';
import { Product } from '../../data/types';

interface ProductDetailsProps {
	product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
	return (
		<View style={styles.container}>
			<Typography size='xlarge' weight='medium'>
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
