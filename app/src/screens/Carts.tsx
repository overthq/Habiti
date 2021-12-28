import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import CartsListItem from '../components/carts/CartsListItem';
import ListEmpty from '../components/global/ListEmpty';
import { useNavigation } from '@react-navigation/native';
import { useCartsQuery } from '../types/api';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../types/navigation';

const Carts: React.FC = () => {
	const [{ data, fetching }] = useCartsQuery();
	const { navigate } =
		useNavigation<BottomTabNavigationProp<HomeTabParamList, 'Carts'>>();

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	const carts = data?.currentUser.carts;

	return (
		<View style={styles.container}>
			<FlatList
				style={styles.list}
				keyExtractor={c => c.storeId}
				renderItem={({ item }) => <CartsListItem cart={item} />}
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
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
	list: {
		paddingHorizontal: 16
	},
	separator: {
		width: '100%',
		height: 1,
		backgroundColor: '#D3D3D3'
	}
});

export default Carts;
