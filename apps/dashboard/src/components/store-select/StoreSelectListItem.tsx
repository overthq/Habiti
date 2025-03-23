import React from 'react';
import { Typography, useTheme } from '@habiti/components';
import { Pressable, View, StyleSheet } from 'react-native';

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
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					width: 80,
					height: 80,
					borderWidth: 2,
					borderRadius: 50,
					borderColor: selected ? theme.text.primary : theme.border.color,
					marginBottom: 4
				}}
			>
				<Typography size='xxlarge'>{text[0]}</Typography>
			</View>
			<Typography
				weight={selected ? 'medium' : undefined}
				style={{ textAlign: 'center' }}
			>
				{text}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 12,
		marginBottom: 8
	}
});

export default StoreSelectListItem;
