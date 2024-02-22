import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { ProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import Typography from '../global/Typography';
import CustomImage from '../global/CustomImage';

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
			<CustomImage
				uri={product.images[0]?.path}
				style={styles.image}
				height={48}
				width={48}
			/>
			<View>
				<Typography style={styles.name}>{product.name}</Typography>
				<Typography variant='secondary'>
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
		marginBottom: 2
	},
	left: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	image: {
		marginRight: 12
	}
});

export default ProductsListItem;
