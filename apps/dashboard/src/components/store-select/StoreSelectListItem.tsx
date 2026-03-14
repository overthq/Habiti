import React from 'react';
import { Avatar, Spacer, Typography, useTheme } from '@habiti/components';
import { Pressable, StyleSheet } from 'react-native';
import { Store } from '../../data/types';

interface StoresListItemProps {
	selected: boolean;
	store: Store;
	onPress(): void;
}

const StoreSelectListItem: React.FC<StoresListItemProps> = ({
	selected,
	onPress,
	store
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
			<Avatar
				uri={store.image?.path}
				fallbackText={store.name}
				size={56}
				circle
			/>
			<Spacer x={12} />
			<Typography
				size='large'
				weight={selected ? 'medium' : undefined}
				style={{ textAlign: 'center' }}
			>
				{store.name}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default StoreSelectListItem;
