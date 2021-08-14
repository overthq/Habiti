import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartsListItem from '../components/carts/CartsListItem';
import ListEmpty from '../components/global/ListEmpty';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../redux/store';
import { useCartsQuery } from '../types/api';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../types/navigation';

const Carts = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [{ data, fetching, error }] = useCartsQuery({ variables: { userId } });
	const { navigate } =
		useNavigation<BottomTabNavigationProp<HomeTabParamList, 'Carts'>>();

	if (fetching) {
		return (
			<View>
				<Text>Loading carts...</Text>
			</View>
		);
	}
	if (error) console.log(error);

	const carts = data?.carts;

	return (
		<SafeAreaView style={styles.container}>
			{/* Very bad: find good way to fix weird extra scroll space in FlatList */}
			{carts?.length === 0 ? (
				<View
					style={{
						flex: 1,
						paddingHorizontal: 16,
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<View
						style={[styles.header, { position: 'absolute', top: 0, left: 16 }]}
					>
						<Text style={styles.title}>Carts</Text>
					</View>
					<ListEmpty
						title='Empty cart'
						description={`Looks like your cart is empty. Let's change that.`}
						cta={{
							text: 'Discover new stores',
							action: () => navigate('Explore')
						}}
					/>
				</View>
			) : (
				<FlatList
					style={styles.list}
					bounces={false}
					keyExtractor={c => c.store_id}
					// ListHeaderComponent={
					// 	<View style={styles.header}>
					// 		<Text style={styles.title}>Carts</Text>
					// 	</View>
					// }
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
						/>
					}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
				/>
			)}
		</SafeAreaView>
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
