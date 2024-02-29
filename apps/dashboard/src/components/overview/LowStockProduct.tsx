import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface LowStockProductProps {
	onPress(): void;
	product: ProductsQuery['currentStore']['products'][number];
}

const LowStockProduct: React.FC<LowStockProductProps> = ({
	onPress,
	product
}) => {
	return (
		<Pressable onPress={onPress} style={{ marginRight: 8, width: 160 }}>
			<CustomImage uri={product.images[0]?.path} height={160} width={160} />
			<Typography weight='medium' style={styles.text} ellipsize>
				{product.name}
			</Typography>
			<Typography variant='label' style={styles.text} ellipsize>
				{formatNaira(product.unitPrice)}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	text: {
		marginTop: 2
	}
});

export default LowStockProduct;
