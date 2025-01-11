import React from 'react';
import { Pressable, StyleSheet, PressableProps } from 'react-native';

import Typography from './Typography';
import { ThemeObject } from './styles/theme';
import { Icon, IconType } from './Icon';
import { useTheme } from './Theme';

interface SmallButtonProps extends PressableProps {
	variant?: keyof ThemeObject['button'];
	text: string;
	icon?: IconType;
}

const SmallButton: React.FC<SmallButtonProps> = ({
	text,
	icon,
	variant = 'primary',
	...props
}) => {
	const { theme } = useTheme();
	const colors = theme.button[variant];

	return (
		<Pressable
			style={[styles.container, { backgroundColor: colors.background }]}
			{...props}
		>
			{icon && <Icon name={icon} size={12} color={colors.text} />}
			<Typography weight='medium' size='small' style={{ color: colors.text }}>
				{text}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
	},
	text: {
		fontSize: 12
	}
});

export default SmallButton;
