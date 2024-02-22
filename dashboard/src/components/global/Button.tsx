import React from 'react';
import {
	Pressable,
	ActivityIndicator,
	StyleSheet,
	ViewStyle,
	PressableProps
} from 'react-native';
import useTheme from '../../hooks/useTheme';
import Typography from './Typography';

interface ButtonProps extends PressableProps {
	variant?: 'primary' | 'secondary' | 'tertiary';
	text: string;
	loading?: boolean;
	style?: ViewStyle;
	size?: 'regular' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
	onPress,
	text,
	loading,
	style,
	variant = 'primary',
	...props
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[
				styles.container,
				{ backgroundColor: theme.button[variant].background },
				style
			]}
			onPress={onPress}
			disabled={loading || props.disabled}
			{...props}
		>
			{loading ? (
				<ActivityIndicator />
			) : (
				<Typography
					weight='medium'
					style={[styles.text, { color: theme.button[variant].text }]}
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
		height: 40,
		borderRadius: 4
	},
	text: {
		fontSize: 17
	}
});

export default Button;
