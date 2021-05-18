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
import { SafeAreaView } from 'react-native-safe-area-context';
import { updatePreference } from '../redux/preferences/actions';
import { useManagedStoresQuery } from '../types/api';
import { useAppSelector } from '../redux/store';

const StoreSelect: React.FC = () => {
	const dispatch = useDispatch();
	const { navigate } = useNavigation();
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [{ data }] = useManagedStoresQuery({ variables: { userId } });

	const managers = data?.store_managers;
	const stores = managers?.map(({ store }) => store);

	const handleStoreSelect = (storeId: string) => {
		dispatch(updatePreference({ activeStore: storeId }));
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Select store</Text>
			<Text style={{ fontSize: 17 }}>
				Kindly select a store you manage, or create a new one:
			</Text>
			<FlatList
				horizontal
				data={stores}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleStoreSelect(item.id)}>
						<Text>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
			<TouchableOpacity
				onPress={() => navigate('CreateStore')}
				style={{ alignSelf: 'center', marginBottom: 16 }}
			>
				<Text>Create a store</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	header: {
		fontWeight: 'bold',
		fontSize: 34,
		marginBottom: 8
	}
});

export default StoreSelect;
