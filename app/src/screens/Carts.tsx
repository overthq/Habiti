import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CartsListItem from '../components/carts/CartsListItem';
import ListEmpty from '../components/global/ListEmpty';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCartsQuery } from '../types/api';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
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
		<View style={styles.container}>
			<FlatList
				keyExtractor={c => c.id}
				renderItem={({ item }) => (
					<CartsListItem cart={item} onPress={handleCartPress(item.id)} />
				)}
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
					refetch({
						requestPolicy: 'cache-and-network'
					});
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 4,
		backgroundColor: '#FFFFFF'
	},
	header: {
		paddingVertical: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	},
	separator: {
		width: '100%',
		height: 1,
		backgroundColor: '#D3D3D3'
	}
});

export default Carts;
