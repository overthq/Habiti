import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useManagersQuery } from '../types/api';

// TODO: Display "you" if current row is currently active user.

const Managers = () => {
	const [{ data, fetching }] = useManagersQuery();

	if (fetching || !data) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			{data.currentStore.managers.map(({ id, manager }) => (
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
