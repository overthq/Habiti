import { ListEmpty, Screen } from '@market/components';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';

import CartsListItem from '../components/carts/CartsListItem';
import { useCartsQuery } from '../types/api';
import { AppStackParamList, HomeTabParamList } from '../types/navigation';

const Carts: React.FC = () => {
	const [{ data, fetching }, refetch] = useCartsQuery();
	const { navigate } =
		useNavigation<BottomTabNavigationProp<HomeTabParamList, 'Carts'>>();
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();

	const carts = data?.currentUser.carts;

	const handleCartPress = React.useCallback(
		(cartId: string) => () => {
			navigation.navigate('Cart', { cartId });
		},
		[]
	);

	return (
		<Screen>
			<FlashList
				keyExtractor={c => c.id}
				renderItem={({ item }) => (
					<CartsListItem cart={item} onPress={handleCartPress(item.id)} />
				)}
				estimatedItemSize={66}
				data={carts}
				ListEmptyComponent={
					<ListEmpty
						title='Empty cart'
						description={`Looks like your cart is empty. Let's change that.`}
						cta={{
							text: 'Discover new stores',
							action: () => navigate('Explore')
						}}
						viewStyle={{ marginTop: 32 }}
					/>
				}
				refreshing={fetching}
				onRefresh={() => {
					refetch({ requestPolicy: 'cache-and-network' });
				}}
			/>
		</Screen>
	);
};

export default Carts;
