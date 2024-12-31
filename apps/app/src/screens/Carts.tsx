import { ListEmpty, Screen, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';

import CartsListItem from '../components/carts/CartsListItem';
import { useCartsQuery } from '../types/api';
import { AppStackParamList, MainTabParamList } from '../types/navigation';

// TODO:
// - Maintain a list of recently viewed stores and items,
//   so that we can use them in the empty state for this screen.
// - Add "Edit" mode to this screen (with nice animations).

const Carts: React.FC = () => {
	const [{ data, fetching }, refetch] = useCartsQuery();
	const [refreshing, setRefreshing] = React.useState(false);
	const { navigate } =
		useNavigation<NavigationProp<MainTabParamList & AppStackParamList>>();
	const { theme } = useTheme();

	React.useEffect(() => {
		if (!fetching && refreshing) {
			setRefreshing(false);
		}
	}, [fetching, refreshing]);

	const carts = data?.currentUser.carts;

	const handleCartPress = React.useCallback(
		(cartId: string) => () => {
			navigate('Cart', { cartId });
		},
		[navigate]
	);

	const handleRefresh = () => {
		setRefreshing(true);
		refetch();
	};

	return (
		<Screen>
			<FlatList
				style={{ flex: 1 }}
				keyExtractor={c => c.id}
				renderItem={({ item }) => (
					<CartsListItem cart={item} onPress={handleCartPress(item.id)} />
				)}
				// estimatedItemSize={66}
				data={carts}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={() => (
					<ListEmpty
						title='Empty cart'
						description={`Looks like your cart is empty. Let's change that.`}
						cta={{
							text: 'Discover new stores',
							action: () => navigate('Main.Explore')
						}}
						viewStyle={{ flex: 1 }}
					/>
				)}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={theme.text.secondary}
					/>
				}
			/>
		</Screen>
	);
};

export default Carts;
