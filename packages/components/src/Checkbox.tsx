import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { useTheme } from './Theme';

interface CheckBoxProps {
	active?: boolean;
	onPress: (value: boolean) => void;
}

const Checkbox: React.FC<CheckBoxProps> = ({ active, onPress }) => {
	const { theme } = useTheme();
	return (
		<Pressable onPress={() => onPress(!active)}>
			<View
				style={[
					styles.square,
					{
						borderColor: !active ? theme.icon.default.color : theme.text.primary
					}
				]}
			>
				{active && (
					<View style={[styles.check, { backgroundColor: theme.text.primary }]}>
						<Icon name='check' size={14} color={theme.text.invert} />
					</View>
				)}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	square: {
		height: 20,
		width: 20,
		borderRadius: 4,
		borderWidth: 1.5,
		overflow: 'hidden'
	},
	check: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%'
	}
});

export default Checkbox;
