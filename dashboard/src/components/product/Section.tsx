import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

interface SectionProps {
	title: string;
	placeholder: string;
	field: string;
	multiline?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, field, multiline }) => {
	const { values, handleChange, handleBlur } = useFormikContext<any>();

	return (
		<View style={styles.section}>
			<Text style={styles.title}>{title}</Text>
			<TextInput
				value={values[field]}
				onChangeText={handleChange(field)}
				onBlur={handleBlur(field)}
				style={styles.input}
				multiline={multiline}
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
