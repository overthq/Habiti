import { formatNaira } from '@habiti/common';
import { Typography, useTheme } from '@habiti/components';
import React from 'react';
import { Controller } from 'react-hook-form';
import { TextInput, StyleSheet, Pressable } from 'react-native';

const CurrencyInput = () => {
	const [mode, setMode] = React.useState<'view' | 'input'>('view');
	const inputRef = React.useRef<TextInput>(null);
	const { theme } = useTheme();

	const formatValue = React.useCallback((value: string) => {
		return formatNaira(value ? Number(value) : 0);
	}, []);

	const handleBlur = () => {
		setMode('view');
	};

	return (
		<Controller
			name='unitPrice'
			render={({ field: { onChange, onBlur, value } }) =>
				mode === 'view' ? (
					<Pressable onPress={() => setMode('input')}>
						<Typography style={[styles.text, { color: theme.text.primary }]}>
							{formatValue(value)}
						</Typography>
					</Pressable>
				) : (
					<TextInput
						ref={inputRef}
						value={value}
						onChangeText={onChange}
						style={[styles.text, { color: theme.text.primary }]}
						onBlur={() => {
							handleBlur();
							onBlur();
						}}
						keyboardType='number-pad'
						autoFocus
					/>
				)
			}
		/>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 17
	}
});

export default CurrencyInput;
