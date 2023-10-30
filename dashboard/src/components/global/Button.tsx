import React from 'react';
import {
	Text,
	Pressable,
	ActivityIndicator,
	StyleSheet,
	ViewStyle,
	PressableProps
} from 'react-native';
import useTheme from '../../hooks/useTheme';

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
				<Text style={[styles.text, { color: theme.button[variant].text }]}>
					{text}
				</Text>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 45,
		maxHeight: 45,
		borderRadius: 4
	},
	text: {
		fontSize: 17,
		fontWeight: '500'
	}
});

export default Button;
