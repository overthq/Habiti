import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItemQuery } from '../types/api';

const Item: React.FC = () => {
	const { params } = useRoute();
	const { itemId } = params;
	const [{ data }] = useItemQuery({ variables: { itemId } });

	const item = data?.items[0];

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
