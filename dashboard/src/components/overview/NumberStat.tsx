import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNaira } from '../../utils/currency';

interface NumberStatProps {
	title: string;
	value: number;
	currency?: boolean;
}

const NumberStat: React.FC<NumberStatProps> = ({ title, value, currency }) => (
	<View style={styles.container}>
		<Text style={styles.title}>{title}</Text>
		<Text style={styles.value}>{currency ? formatNaira(value) : value}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		width: '50%'
	},
	title: {
		fontSize: 14,
		color: '#505050',
		marginBottom: 4,
		textTransform: 'uppercase'
	},
	value: {
		fontSize: 20,
		fontWeight: '500'
	}
});

export default NumberStat;
