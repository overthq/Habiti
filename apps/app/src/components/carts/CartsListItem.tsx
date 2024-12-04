import {
	CustomImage,
	Icon,
	Row,
	Typography,
	useTheme
} from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CartsQuery } from '../../types/api';
import { plural } from '../../utils/strings';

interface CartListItemProps {
	cart: CartsQuery['currentUser']['carts'][number];
	onPress(): void;
}

const CartsListItem: React.FC<CartListItemProps> = ({ cart, onPress }) => {
	const { theme } = useTheme();

	return (
		<Row onPress={onPress} style={styles.container}>
			<View style={styles.main}>
				<CustomImage
					uri={cart.store.image?.path}
					style={styles.image}
					height={48}
					width={48}
				/>
				<View>
					<Typography weight='medium'>{cart.store.name}</Typography>
					<Typography size='small' variant='secondary'>
						{plural('product', cart.products.length)}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' size={24} color={theme.text.secondary} />
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	main: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	image: {
		marginRight: 10,
		borderRadius: 30
	}
});

export default CartsListItem;
