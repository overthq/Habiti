import { ListEmpty, Screen, ScreenHeader, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
// import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CartsListItem from '../components/carts/CartsListItem';
import { useCartsQuery } from '../data/queries';
import useRefreshing from '../hooks/useRefreshing';
import { AppStackParamList, MainTabParamList } from '../types/navigation';

const Carts: React.FC = () => {
	const { data, refetch } = useCartsQuery();
	const { refreshing, handleRefresh } = useRefreshing(refetch);
	const { navigate } =
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
			<ScreenHeader title='Carts' />
			<FlatList
				style={{ flex: 1 }}
				keyExtractor={c => c.id}
				renderItem={({ item }) => (
					<CartsListItem cart={item} onPress={handleCartPress(item.id)} />
				)}
				// estimatedItemSize={66}
				data={data?.carts}
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
