import React from 'react';
import {
	Text,
	Pressable,
	ActivityIndicator,
	StyleSheet,
	ViewStyle,
	PressableProps
} from 'react-native';

const variants = {
	primary: {
		background: '#000000',
		text: '#FFFFFF'
	},
	secondary: {
		background: '#D3D3D3',
		text: '#505050'
	},
	tertiary: {
		background: '#505050',
		text: '#D3D3D3'
	}
} as const;

interface ButtonProps extends PressableProps {
	variant?: keyof typeof variants;
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
}) => (
	<Pressable
		style={[
			styles.container,
			{ backgroundColor: variants[variant].background },
			style
		]}
		onPress={onPress}
		disabled={loading || props.disabled}
		{...props}
	>
		{loading ? (
			<ActivityIndicator />
		) : (
			<Text style={[styles.text, { color: variants[variant].text }]}>
				{text}
			</Text>
		)}
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 45,
		borderRadius: 4
	},
	text: {
		fontSize: 17,
		fontWeight: '500'
	}
});

export default Button;
