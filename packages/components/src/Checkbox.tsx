import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { useTheme } from './Theme';

interface CheckBoxProps {
	active?: boolean;
	onPress: (value: boolean) => void;
}

const CHECKBOX_SIZE = 20;
const CHECKBOX_BORDER_WIDTH = 2;
const CHECKBOX_RADIUS = 4;

const Checkbox: React.FC<CheckBoxProps> = ({ active, onPress }) => {
	const { theme } = useTheme();

	return (
		<Pressable
			onPress={() => onPress(!active)}
			style={[
				styles.square,
				{
					borderColor: active ? theme.text.primary : theme.border.color,
					backgroundColor: active ? theme.text.primary : 'transparent'
				}
			]}
		>
			{active && <Icon name='check' size={14} color={theme.text.invert} />}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	square: {
		height: CHECKBOX_SIZE,
		width: CHECKBOX_SIZE,
		borderWidth: CHECKBOX_BORDER_WIDTH,
		borderRadius: CHECKBOX_RADIUS,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Checkbox;
