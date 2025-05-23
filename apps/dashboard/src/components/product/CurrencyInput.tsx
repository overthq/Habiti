import React from 'react';
import { Pressable, View } from 'react-native';
import { formatNaira } from '@habiti/common';
import { Typography, useTheme } from '@habiti/components';

interface CurrencyInputProps {
	value: number;
	onPress: () => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onPress }) => {
	const { theme } = useTheme();

	const formatValue = React.useCallback((value: string) => {
		return formatNaira(value ? Number(value) : 0);
	}, []);

	return (
		<Pressable
			style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
			onPress={onPress}
		>
			<Typography size='xlarge' style={{ color: theme.text.primary }}>
				{formatValue(value.toString())}
			</Typography>
			<View
				style={{
					borderRadius: 100,
					paddingVertical: 4,
					paddingHorizontal: 8,
					backgroundColor: theme.text.primary
				}}
			>
				<Typography variant='invert' size='small'>
					Edit
				</Typography>
			</View>
		</Pressable>
	);
};

export default CurrencyInput;
