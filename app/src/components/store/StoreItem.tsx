import React from 'react';
import {
	FlatList,
	View,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStoreItemsQuery } from '../../types/api-types';

interface StoreItemsProps {
	storeId: string;
	header: React.FC;
}

const StoreItems: React.FC<StoreItemsProps> = ({ storeId, header }) => {
	const [{ data }] = useStoreItemsQuery({
		variables: { storeId }
	});
	const { navigate } = useNavigation();

	// TODO(koredefashokun): Implement loading state with react-native-skeleton-content.

	return (
		<FlatList
			data={data?.storeItems}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={header}
			renderItem={({ item }) => (
				<View style={{ flex: 1, flexDirection: 'column' }}>
					<TouchableOpacity
						key={item.id}
						style={{ flex: 1, margin: 10 }}
						onPress={() => navigate('Item', { itemId: item.id })}
						activeOpacity={0.8}
					>
						<View style={styles.itemImage} />
						<Text style={styles.itemName}>{item.name}</Text>
						<Text style={{ color: '#505050', fontSize: 15 }}>
							${item.price_per_unit}
						</Text>
					</TouchableOpacity>
				</View>
			)}
			numColumns={2}
		/>
	);
};

const styles = StyleSheet.create({
	itemName: {},
	itemImage: {}
});

export default StoreItems;
