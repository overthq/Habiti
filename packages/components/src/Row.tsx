import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';

import { useTheme } from './Theme';

interface RowProps extends PressableProps {
	children: React.ReactNode;
	style: StyleProp<ViewStyle>;
}

const Row: React.FC<RowProps> = ({ style, children, ...props }) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? theme.row.focus : 'transparent',
					paddingHorizontal: 16,
					paddingVertical: 6
				},
				style
			]}
			{...props}
		>
			{children}
		</Pressable>
	);
};

export default Row;
