import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartsListItem from '../components/carts/CartsListItem';
import ListEmpty from '../components/global/ListEmpty';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../redux/store';

const Carts = () => {
	const carts = useAppSelector(({ carts }) => carts.carts);
	// const { carts } = React.useContext(CartsContext);
	const { navigate } = useNavigation();

	const cartsArray = React.useMemo(() => Object.entries(carts), [carts]);

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				keyExtractor={c => c[0]}
				ListHeaderComponent={
					<View style={styles.header}>
						<Text style={styles.title}>Carts</Text>
					</View>
				}
				renderItem={({ item }) => <CartsListItem cart={item} />}
				data={cartsArray}
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
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20,
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
