import React from 'react';
import { View, StyleSheet } from 'react-native';
import ManagerRow from '../components/managers/ManagerRow';
import useGoBack from '../hooks/useGoBack';
import { useManagersQuery } from '../types/api';

// TODO: Display "you" if current row is currently active user.

const Managers = () => {
	const [{ data, fetching }] = useManagersQuery();
	useGoBack();

	if (fetching || !data) {
		return <View />;
	}

	return (
		<View style={styles.container}>
			<View style={styles.managers}>
				{data.currentStore.managers.map(({ id, manager }) => (
					<ManagerRow key={id} manager={manager} />
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16
	},
	managers: {
		backgroundColor: '#FFFFFF',
		borderRadius: 4
	}
});

export default Managers;
