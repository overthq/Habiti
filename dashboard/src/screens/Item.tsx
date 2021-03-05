import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItemQuery } from '../types/api';
import { ItemsStackParamList } from '../types/navigation';

const Item: React.FC = () => {
	const { params } = useRoute<RouteProp<ItemsStackParamList, 'Item'>>();
	const { itemId } = params;
	const [{ data }] = useItemQuery({ variables: { itemId } });

	const item = data?.items_by_pk;

	return (
		<SafeAreaView style={styles.container}>
			<Text>{item?.name}</Text>
			<Text>Description</Text>
			<Text>{item?.description}</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Item;
