import React from 'react';
import {
	Pressable,
	ActivityIndicator,
	StyleSheet,
	ViewStyle,
	PressableProps
} from 'react-native';

import { useTheme } from './Theme';
import Typography from './Typography';
import { ThemeObject } from './styles/theme';

interface ButtonProps extends PressableProps {
	variant?: keyof ThemeObject['button'];
	text: string;
	loading?: boolean;
	style?: ViewStyle;
	size?: 'regular' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
	text,
	loading,
	style,
	variant = 'primary',
	disabled,
	...props
}) => {
	const { theme } = useTheme();
	const colors = theme.button[disabled ? 'disabled' : variant];

	return (
		<Pressable
			style={[styles.container, { backgroundColor: colors.background }, style]}
			disabled={loading || disabled}
			{...props}
		>
			{loading ? (
				<ActivityIndicator />
			) : (
				<Typography
					weight='medium'
					style={[styles.text, { color: colors.text }]}
				>
					{text}
				</Typography>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 44,
		borderRadius: 6
	},
	text: {
		fontSize: 17
	}
});

export default Button;
