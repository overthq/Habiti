import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';

import { useTheme } from './Theme';
import Typography, { applyFontStyles } from './Typography';

export interface BaseInputProps extends TextInputProps {
	ref?: React.Ref<TextInput>;
	as?: React.ComponentType<TextInputProps & React.RefAttributes<TextInput>>;
	number?: boolean;
}

export const BaseInput: React.FC<BaseInputProps> = ({
	as: Component = TextInput,
	style,
	number,
	...props
}) => {
	const { name, theme } = useTheme();

	return (
		<Component
			placeholderTextColor={theme.input.placeholder}
			keyboardAppearance={name === 'dark' ? 'dark' : 'light'}
			selectionColor={theme.text.primary}
			{...props}
			style={[
				styles.base,
				{ color: theme.input.text },
				style,
				applyFontStyles(number ? { fontVariant: ['tabular-nums'] } : {})
			]}
		/>
	);
};

export interface InputProps extends BaseInputProps {
	label?: string;
	textArea?: boolean;
}

const Input: React.FC<InputProps> = ({ label, textArea, style, ...props }) => {
	const { theme } = useTheme();

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
			<BaseInput
				{...props}
				multiline={textArea}
				style={[
					{ backgroundColor: theme.input.background },
					styles.input,
					textArea && styles.textArea,
					style
				]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	base: {
		includeFontPadding: false
	},
	label: {
		marginBottom: 4
	},
	input: {
		fontSize: 16,
		paddingLeft: 8,
		height: 40,
		borderRadius: 6,
		textAlignVertical: 'top'
	},
	textArea: {
		paddingTop: 8,
		height: 80
	}
});

export default Input;
