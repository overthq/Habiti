import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updatePreference } from '../redux/preferences/actions';
import { useManagedStoresQuery } from '../types/api';

const StoreSelect: React.FC = () => {
	const dispatch = useDispatch();
	const { navigate } = useNavigation();
	const [{ data }] = useManagedStoresQuery();

	const managers = data?.store_managers;
	const stores = managers?.map(({ store }) => store);

	const handleStoreSelect = (storeId: string) => {
		dispatch(updatePreference({ activeStore: storeId }));
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Select store</Text>
			<Text>Kindly select a store you manage, or create a new one:</Text>
			<FlatList
				horizontal
				data={stores}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleStoreSelect(item.id)}>
						<Text>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
			<TouchableOpacity onPress={() => navigate('CreateStore')}>
				<Text>Create a store</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	header: {
		fontWeight: 'bold',
		fontSize: 34
	}
});

export default StoreSelect;
