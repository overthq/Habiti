import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NumberStatProps {
	title: string;
	value: number;
}

const NumberStat: React.FC<NumberStatProps> = ({ title, value }) => (
	<View style={styles.container}>
		<Text style={styles.title}>{title}</Text>
		<Text style={styles.value}>{value}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8
	},
	title: {
		fontSize: 14,
		marginBottom: 4,
		textTransform: 'uppercase'
	},
	value: {
		fontSize: 20,
		fontWeight: '500'
	}
});

export default NumberStat;
