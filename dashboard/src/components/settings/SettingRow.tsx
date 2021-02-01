import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SettingRowProps {
	name: string;
	screenTo?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({ name }) => {
	return (
		<TouchableOpacity style={styles.container}>
			<Text>{name}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default SettingRow;
