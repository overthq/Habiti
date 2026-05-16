import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	Avatar,
	Icon,
	Row,
	Typography,
	ListEmpty,
	Screen,
	ScreenHeader,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { useCartsQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';

import { plural } from '../utils/strings';

import type { Cart } from '../data/types';
import type { AppStackParamList, MainTabParamList } from '../navigation/types';

const Carts = () => {
	const { data, refetch } = useCartsQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { navigate, goBack } =
		useNavigation<NavigationProp<MainTabParamList & AppStackParamList>>();
	const { theme } = useTheme();

	const handleCartPress = React.useCallback(
		(cartId: string) => () => {
			navigate('Cart', { cartId });
		},
		[navigate]
	);

	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Carts' hasBottomBorder goBack={goBack} />
			<FlatList
				style={{ flex: 1, marginHorizontal: -16 }}
				keyExtractor={c => c.id}
				renderItem={({ item }) => (
					<CartsListItem cart={item} onPress={handleCartPress(item.id)} />
				)}
				data={data?.carts}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={() => (
					<ListEmpty
						title='Empty cart'
						description={`Looks like your cart is empty. Let's change that.`}
						viewStyle={{ flex: 1 }}
					/>
				)}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						tintColor={theme.text.secondary}
					/>
				}
			/>
		</Screen>
	);
};

interface CartListItemProps {
	cart: Cart;
	onPress(): void;
}

const CartsListItem: React.FC<CartListItemProps> = ({ cart, onPress }) => {
	const { theme } = useTheme();

	return (
		<Row onPress={onPress} style={styles.container}>
			<View style={styles.main}>
				<Avatar
					uri={cart.store.image?.path}
					style={styles.image}
					fallbackText={cart.store.name}
					size={48}
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

export default Carts;
