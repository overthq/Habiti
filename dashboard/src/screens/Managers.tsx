import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useStore from '../state';
import { useManagersQuery } from '../types/api';

// TODO: Display "you" if current row is currently active user.

const Managers = () => {
	const activeStore = useStore(({ activeStore }) => activeStore);
	const [{ data, fetching }] = useManagersQuery({
		variables: { storeId: activeStore as string }
	});

	if (fetching || !data) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			{data.store.managers.map(({ id, manager }) => (
				<View key={id}>
					<Text>{manager.name}</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Managers;
