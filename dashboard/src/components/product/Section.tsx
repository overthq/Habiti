import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';

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

	return (
		<View style={styles.section}>
			<Text style={styles.title}>{title}</Text>
			<Controller
				name={field}
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						style={styles.input}
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
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	title: {
		marginBottom: 2,
		fontSize: 16,
		color: '#505050',
		fontWeight: '500'
	},
	input: {
		fontSize: 18
	}
});

export default Section;
