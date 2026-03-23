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

interface PillButtonProps extends PressableProps {
	variant?: keyof ThemeObject['button'];
	text: string;
	loading?: boolean;
	style?: ViewStyle;
	size?: 'small' | 'regular' | 'large';
}

const sizeMap = {
	small: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		fontSize: 13
	},
	regular: {
		paddingVertical: 9,
		paddingHorizontal: 18,
		fontSize: 15
	},
	large: {
		paddingVertical: 12,
		paddingHorizontal: 22,
		fontSize: 15
	}
} as const;

const PillButton: React.FC<PillButtonProps> = ({
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
	const sizing = sizeMap[size];

	return (
		<Pressable
			style={[
				styles.container,
				{
					backgroundColor: colors.background,
					paddingVertical: sizing.paddingVertical,
					paddingHorizontal: sizing.paddingHorizontal
				},
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
						{ color: colors.text, fontSize: sizing.fontSize }
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
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 999,
		alignSelf: 'flex-start'
	},
	text: {
		fontSize: 15
	}
});

export default PillButton;
