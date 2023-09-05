import React from 'react';
import {
	Text,
	Pressable,
	ActivityIndicator,
	StyleSheet,
	ViewStyle
} from 'react-native';

interface ButtonProps {
	onPress(): void;
	text: string;
	loading?: boolean;
	disabled?: boolean;
	style?: ViewStyle;
	variant?: 'primary' | 'secondary' | 'tertiary';
}

const variants = {
	primary: {
		background: {
			backgroundColor: '#000000'
		},
		text: {
			color: '#FFFFFF'
		}
	},
	secondary: {
		background: {
			backgroundColor: '#FFFFFF'
		},
		text: {
			color: '#000000'
		}
	},
	tertiary: {
		background: {
			backgroundColor: '#505050'
		},
		text: {
			color: '#D3D3D3'
		}
	}
};

const sizes = {
	sm: {},
	md: {},
	xl: {}
};

const Button: React.FC<ButtonProps> = ({
	onPress,
	text,
	loading,
	style,
	disabled,
	variant = 'primary'
}) => (
	<Pressable
		style={[variants[variant].background, styles.container, style]}
		disabled={disabled}
		onPress={onPress}
	>
		{loading ? (
			<ActivityIndicator color='#FFFFFF' />
		) : (
			<Text style={[variants[variant].text, styles.text]}>{text}</Text>
		)}
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000',
		height: 45,
		borderRadius: 4
	},
	text: {
		fontSize: 17,
		fontWeight: '500',
		color: '#FFFFFF'
	}
});

export default Button;
