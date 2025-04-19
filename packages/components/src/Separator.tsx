import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

import { useTheme } from './Theme';

interface SeparatorProps extends ViewProps {
	inset?: boolean;
}

const Separator: React.FC<SeparatorProps> = ({ inset, style, ...props }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.border.color },
				inset ? { marginLeft: 12 } : {},
				style
			]}
			{...props}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 1,
		marginVertical: 2
	}
});

export default Separator;
