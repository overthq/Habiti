import { useTheme, Typography } from '@habiti/components';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View, TextInput, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';

interface SectionProps {
	title: string;
	placeholder: string;
	field: string;
	inputProps?: TextInputProps;
	children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
	title,
	field,
	placeholder,
	inputProps,
	children
}) => {
	// const { control } = useFormContext();
	const { theme } = useTheme();

	return (
		<View style={styles.section}>
			<Typography
				weight='medium'
				style={[styles.title, { color: theme.input.label }]}
			>
				{title}
			</Typography>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		paddingVertical: 8,
		paddingHorizontal: 16
	},
	title: {
		marginBottom: 2
	},
	input: {
		fontSize: 17
	}
});

export default Section;
