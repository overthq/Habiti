import React from 'react';
import { View, StyleSheet } from 'react-native';
import { formatNaira } from '@habiti/common';
import {
	CustomImage,
	Typography,
	Row,
	Icon,
	useTheme,
	Spacer
} from '@habiti/components';

import { OrderProduct as OrderProductType } from '../../data/types';

interface OrderProductProps {
	orderProduct: OrderProductType;
	onPress(): void;
	isLast?: boolean;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress,
	isLast
}) => {
	const { theme } = useTheme();

	return (
		<Row
			onPress={onPress}
			style={[
				styles.container,
				{ backgroundColor: 'transparent' },
				!isLast && {
					borderBottomWidth: 0.5,
					borderBottomColor: theme.border.color
				}
			]}
		>
			<View style={styles.left}>
				<CustomImage
					uri={product.images[0]?.path}
					height={44}
					width={44}
					style={styles.image}
				/>
				<View>
					<Typography>{product.name}</Typography>
					<Spacer y={2} />
					<Typography size='regular' variant='secondary'>
						{formatNaira(unitPrice * quantity)}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' color={theme.text.secondary} size={20} />
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 10
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	image: {
		marginRight: 10
	}
});

export default OrderProduct;
