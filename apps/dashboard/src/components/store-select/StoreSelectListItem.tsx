import { Typography, useTheme } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface StoresListItemProps {
	text: string;
	selected: boolean;
	onPress(): void;
}

const StoreSelectListItem: React.FC<StoresListItemProps> = ({
	selected,
	onPress,
	text
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.container,
				{ borderColor: selected ? theme.text.primary : theme.border.color }
			]}
		>
			<Typography weight={selected ? 'medium' : undefined}>{text}</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		padding: 12,
		borderRadius: 4,
		marginBottom: 8
	}
});

export default StoreSelectListItem;
