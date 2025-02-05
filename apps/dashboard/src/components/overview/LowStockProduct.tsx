import { formatNaira } from '@habiti/common';
import { CustomImage, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { Pressable } from 'react-native';

import { ProductsQuery } from '../../types/api';

interface LowStockProductProps {
	onPress(): void;
	product: ProductsQuery['currentStore']['products']['edges'][number]['node'];
}

const LowStockProduct: React.FC<LowStockProductProps> = ({
	onPress,
	product
}) => {
	return (
		<Pressable onPress={onPress} style={{ marginRight: 8, width: 160 }}>
			<CustomImage uri={product.images[0]?.path} height={160} width={160} />
			<Spacer y={4} />
			<Typography weight='medium' ellipsize>
				{product.name}
			</Typography>
			<Typography variant='label' ellipsize>
				{formatNaira(product.unitPrice)}
			</Typography>
		</Pressable>
	);
};

export default LowStockProduct;
