import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { ProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import Typography from '../global/Typography';

interface ProductsListItemProps {
	product: ProductsQuery['currentStore']['products'][number];
	onPress(): void;
}

const ProductsListItem: React.FC<ProductsListItemProps> = ({
	product,
	onPress
}) => (
	<Pressable onPress={onPress} style={styles.container}>
		<View style={styles.left}>
			<View style={styles.placeholder}>
				<Image style={styles.image} source={{ uri: product.images[0]?.path }} />
			</View>
			<View>
				<Typography style={styles.name}>{product.name}</Typography>
				<Typography style={styles.price}>
					{formatNaira(product.unitPrice)}
				</Typography>
			</View>
		</View>
		<Icon name='chevron-right' />
	</Pressable>
);

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
		fontSize: 16,
		marginBottom: 2
	},
	price: {
		fontSize: 16,
		color: '#777777'
	},
	left: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	placeholder: {
		overflow: 'hidden',
		height: 48,
		width: 48,
		borderRadius: 4,
		backgroundColor: '#D3D3D3',
		marginRight: 12
	},
	image: {
		height: '100%',
		width: '100%'
	}
});

export default ProductsListItem;
