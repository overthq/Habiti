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
	size?: 'small' | 'regular' | 'large';
}

const sizeMap = {
	small: {
		height: 36,
		fontSize: 15
	},
	regular: {
		height: 44,
		fontSize: 17
	},
	large: {
		height: 48,
		fontSize: 17
	}
} as const;

const Button: React.FC<ButtonProps> = ({
	text,
	loading,
	style,
	variant = 'primary',
	size = 'regular',
	disabled,
	...props
}) => {
	const { theme } = useTheme();
	const colors = theme.button[disabled ? 'disabled' : variant];

	return (
		<Pressable
			style={[
				styles.container,
				{ backgroundColor: colors.background, height: sizeMap[size].height },
				style
			]}
			disabled={loading || disabled}
			{...props}
		>
			{loading ? (
				<ActivityIndicator />
			) : (
				<Typography
					weight='medium'
					style={[
						styles.text,
						{ color: colors.text, fontSize: sizeMap[size].fontSize }
					]}
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
