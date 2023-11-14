import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import useTheme from '../../hooks/useTheme';
import Typography from '../global/Typography';

interface SectionProps {
	title: string;
	placeholder: string;
	field: string;
	inputProps?: TextInputProps;
}

const Section: React.FC<SectionProps> = ({
	title,
	field,
	placeholder,
	inputProps
}) => {
	const { control } = useFormContext();
	const { theme } = useTheme();

	return (
		<View style={styles.section}>
			<Typography style={[styles.title, { color: theme.input.label }]}>
				{title}
			</Typography>
			<Controller
				name={field}
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						style={[styles.input, { color: theme.text.primary }]}
						placeholder={placeholder}
						placeholderTextColor='#777777'
						{...inputProps}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	title: {
		marginBottom: 2,
		fontWeight: '500'
	},
	input: {
		fontSize: 18
	}
});

export default Section;
