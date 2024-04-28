import { useTheme, CustomImage, Icon, Typography } from '@market/components';
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

import { ProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface ProductsListItemProps {
	product: ProductsQuery['currentStore']['products'][number];
	onPress(): void;
}

const ProductsListItem: React.FC<ProductsListItemProps> = ({
	product,
	onPress
}) => {
	const { theme } = useTheme();

	return (
		<Pressable onPress={onPress} style={styles.container}>
			<View style={styles.left}>
				<CustomImage
					uri={product.images[0]?.path}
					style={styles.image}
					height={44}
					width={44}
				/>
				<View>
					<Typography style={styles.name}>{product.name}</Typography>
					<Typography variant='secondary'>
						{formatNaira(product.unitPrice)}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' color={theme.text.secondary} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 12
	},
	name: {
		marginBottom: 2
	},
	left: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	image: {
		marginRight: 8
	}
});

export default ProductsListItem;
