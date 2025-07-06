import { formatNaira } from '@habiti/common';
import {
	useTheme,
	CustomImage,
	Icon,
	Typography,
	Row
} from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ProductsQuery } from '../../types/api';

interface ProductsListItemProps {
	product: ProductsQuery['currentStore']['products']['edges'][number]['node'];
	onPress(): void;
	onLongPress?(): void;
}

const ProductsListItem: React.FC<ProductsListItemProps> = ({
	product,
	onPress,
	onLongPress
}) => {
	const { theme } = useTheme();

	return (
		<Row onPress={onPress} onLongPress={onLongPress} style={styles.container}>
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
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
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
