import React from 'react';
import {
	Text,
	Pressable,
	ActivityIndicator,
	StyleSheet,
	ViewStyle,
	PressableProps
} from 'react-native';

interface ButtonProps extends PressableProps {
	text: string;
	loading?: boolean;
	style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
	onPress,
	text,
	loading,
	style,
	...props
}) => (
	<Pressable style={[styles.container, style]} onPress={onPress} {...props}>
		{loading ? <ActivityIndicator /> : <Text style={styles.text}>{text}</Text>}
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		maxHeight: 40,
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
