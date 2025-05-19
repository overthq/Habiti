import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { formatNaira } from '@habiti/common';
import { Typography, useTheme } from '@habiti/components';

interface CurrencyInputProps {
	value: number;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value }) => {
	const { theme } = useTheme();

	const formatValue = React.useCallback((value: string) => {
		return formatNaira(value ? Number(value) : 0);
	}, []);

	return (
		<Pressable onPress={() => {}}>
			<Typography style={[styles.text, { color: theme.text.primary }]}>
				{formatValue(value.toString())}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 17
	}
});

export default CurrencyInput;
