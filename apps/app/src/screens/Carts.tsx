import { ListEmpty, Screen, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { RefreshControl } from 'react-native';

import CartsListItem from '../components/carts/CartsListItem';
import { useCartsQuery } from '../types/api';
import { AppStackParamList, MainTabParamList } from '../types/navigation';

// TODO:
// - Maintain a list of recently viewed stores and items,
//   so that we can use them in the empty state for this screen.
// - Add "Edit" mode to this screen (with nice animations).

const Carts: React.FC = () => {
	const [{ data, fetching }, refetch] = useCartsQuery();
	const { navigate } =
		useNavigation<NavigationProp<MainTabParamList & AppStackParamList>>();
	const { theme } = useTheme();

	const carts = data?.currentUser.carts;

	const handleCartPress = React.useCallback(
		(cartId: string) => () => {
			navigate('Cart', { cartId });
		},
		[navigate]
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
				contentContainerStyle={{ paddingTop: 8 }}
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
				refreshControl={
					<RefreshControl
						refreshing={fetching}
						onRefresh={() => {
							refetch({ requestPolicy: 'cache-and-network' });
						}}
						tintColor={theme.text.secondary}
					/>
				}
			/>
		</Screen>
	);
};

export default Carts;
