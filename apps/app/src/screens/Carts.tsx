import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListEmpty, Screen, ScreenHeader, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import CartsListItem from '../components/carts/CartsListItem';
import { AppStackParamList, MainTabParamList } from '../types/navigation';
import { useCartsQuery } from '../types/api';
import useRefresh from '../hooks/useRefresh';

const Carts: React.FC = () => {
	const [{ data, fetching }, refetch] = useCartsQuery();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
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
				style={{ flex: 1 }}
				keyExtractor={c => c.id}
				renderItem={({ item }) => (
					<CartsListItem cart={item} onPress={handleCartPress(item.id)} />
				)}
				data={data?.currentUser.carts}
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

export default Carts;
