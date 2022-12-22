import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStoreQuery } from '../types/api';
import StoreProfile from '../components/store/StoreProfile';
import { StoreStackParamList } from '../types/navigation';

const Store: React.FC = () => {
	const [{ data, fetching }] = useStoreQuery();
	const store = data?.currentStore;
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();

	if (fetching || !store) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			<StoreProfile store={store} />
			<Pressable onPress={() => navigate('Manager')}>
				<Text>Managers</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default Store;
