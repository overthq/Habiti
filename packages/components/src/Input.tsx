import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';

import { useTheme } from './Theme';
import Typography from './Typography';

export interface InputProps extends TextInputProps {
	label?: string;
	textArea?: boolean;
}

const Input: React.FC<InputProps> = ({ label, textArea, ...props }) => {
	const { theme } = useTheme();

	const inputColors = React.useMemo(
		() => ({
			backgroundColor: theme.input.background,
			color: theme.input.text
		}),
		[theme.input.background, theme.input.text]
	);

	const style = React.useMemo(() => {
		if (textArea) {
			return [inputColors, styles.input, styles.textArea, props.style];
		} else {
			return [inputColors, styles.input, props.style];
		}
	}, [textArea, props.style]);

	return (
		<View>
			{label && (
				<Typography
					size='small'
					weight='medium'
					style={[styles.label, { color: theme.input.label }]}
				>
					{label}
				</Typography>
			)}
			<TextInput
				placeholderTextColor='#696969'
				multiline={textArea}
				textAlignVertical={textArea ? 'top' : undefined}
				{...props}
				style={style}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		marginBottom: 4
	},
	input: {
		fontSize: 16,
		paddingLeft: 8,
		height: 40,
		borderRadius: 4
	},
	textArea: {
		paddingTop: 8,
		height: 80
	}
});

export default Input;
