import React from 'react';
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreQuery, useStoreItemsQuery } from '../types';
import { CartsContext } from '../contexts/CartsContext';

const StoreItems: React.FC<{ storeId: string }> = ({ storeId }) => {
	const [{ data, fetching }] = useStoreItemsQuery({ variables: { storeId } });
	const { addItemToCart } = React.useContext(CartsContext);

	if (fetching) {
		return <ActivityIndicator />;
	}

	return (
		<FlatList
			data={data?.storeItems}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={<View style={{ marginBottom: 20 }}></View>}
			renderItem={({ item, index }) => {
				return (
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<TouchableOpacity
							key={item.id}
							style={{
								flex: 1,
								...(index % 2 === 0
									? { paddingLeft: 20, paddingRight: 10 }
									: { paddingRight: 20, paddingLeft: 10 })
							}}
							onPress={() =>
								addItemToCart({ storeId, itemId: item.id, quantity: 5 })
							}
							activeOpacity={0.8}
						>
							<View style={styles.itemImage} />
							<Text style={styles.itemName}>{item.name}</Text>
							<Text style={{ color: '#505050', fontSize: 15 }}>
								${item.price_per_unit}
							</Text>
						</TouchableOpacity>
					</View>
				);
			}}
			numColumns={2}
		/>
	);
};

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute();
	const [{ data }] = useStoreQuery({
		variables: { storeId: params?.storeId }
	});

	React.useLayoutEffect(() => {
		setOptions({ title: data?.store.name });
	}, [data]);

	return (
		<View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<StoreItems storeId={data?.store.id} />
		</View>
	);
};

const styles = StyleSheet.create({
	itemImage: {
		backgroundColor: '#D3D3D3',
		borderRadius: 8,
		marginBottom: 10,
		width: '100%',
		height: 250
	},
	itemName: {
		fontSize: 16,
		fontWeight: '500'
	}
});

export default Store;
