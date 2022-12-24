import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ManagersQuery } from '../../types/api';

interface ManagerRowProps {
	manager: ManagersQuery['currentStore']['managers'][number]['manager'];
}

const ManagerRow: React.FC<ManagerRowProps> = ({ manager }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.name}>{manager.name}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	name: {
		fontSize: 16
	}
});

export default ManagerRow;
