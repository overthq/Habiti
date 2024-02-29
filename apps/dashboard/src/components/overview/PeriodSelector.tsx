import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

import { StatPeriod } from '../../types/api';

interface PeriodSelectorProps {
	selectedPeriod: StatPeriod;
	setSelectedPeriod(period: StatPeriod): void;
}

const options = [
	StatPeriod.Day,
	StatPeriod.Week,
	StatPeriod.Month,
	StatPeriod.Year
];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
	selectedPeriod,
	setSelectedPeriod
}) => {
	const handlePeriodSelect = (p: StatPeriod) => () => {
		setSelectedPeriod(p);
	};

	return (
		<View style={styles.container}>
			{options.map(p => (
				<Pressable
					key={p}
					style={styles.tab}
					onPress={handlePeriodSelect(p)}
					disabled={p === selectedPeriod}
				>
					<Text style={styles.text}>{p}</Text>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 40,
		flexDirection: 'row',
		backgroundColor: '#D3D3D3',
		marginBottom: 8
	},
	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 16
	}
});

export default PeriodSelector;
