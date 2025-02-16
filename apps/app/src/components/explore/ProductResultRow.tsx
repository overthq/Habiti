import { CustomImage, Row, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet } from 'react-native';

import { SearchQuery } from '../../types/api';

interface ProductResultRowProps {
	product: SearchQuery['products']['edges'][number]['node'];
	onPress(): void;
}

const ProductResultRow: React.FC<ProductResultRowProps> = ({
	product,
	onPress
}) => {
	return (
		<Row onPress={onPress} style={styles.container}>
			<CustomImage uri={product.images[0]?.path} height={35} width={35} />
			<Spacer x={8} />
			<Typography>{product.name}</Typography>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 4,
		alignItems: 'center'
	}
});

export default ProductResultRow;
