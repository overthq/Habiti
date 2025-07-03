import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';
import { Icon, Spacer, Typography, useTheme } from '@habiti/components';

import StoreSelectListItem from './StoreSelectListItem';
import useStore from '../../state';
import { ManagedStoresQuery } from '../../types/api';

interface StoreSelectListProps {
	stores: ManagedStoresQuery['currentUser']['managed'][number]['store'][];
	onAddStore(): void;
}

const StoreSelectList: React.FC<StoreSelectListProps> = ({
	stores,
	onAddStore
}) => {
	const { setPreference, activeStore } = useStore(
		useShallow(state => ({
			setPreference: state.setPreference,
			activeStore: state.activeStore
		}))
	);

	const handleStoreSelect = React.useCallback(
		(storeId: string) => () => {
			setPreference({ activeStore: storeId });
		},
		[]
	);

	return (
		<Animated.View
			entering={FadeInDown}
			exiting={FadeOutDown}
			style={{ flexDirection: 'row', flexWrap: 'wrap' }}
		>
			{stores.map(store => (
				<StoreSelectListItem
					store={store}
					onPress={handleStoreSelect(store.id)}
					selected={store.id === activeStore}
				/>
			))}
			<CreateStoreButton onPress={onAddStore} />
		</Animated.View>
	);
};

interface CreateStoreButtonProps {
	onPress(): void;
}

const CreateStoreButton: React.FC<CreateStoreButtonProps> = ({ onPress }) => {
	const { theme } = useTheme();

	return (
		<Pressable onPress={onPress}>
			<View style={[styles.add, { backgroundColor: theme.image.placeholder }]}>
				<Icon name='plus' size={24} />
			</View>
			<Spacer y={2} />
			<Typography size='small' style={{ textAlign: 'center' }}>
				New
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	add: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 72,
		height: 72,
		borderRadius: 50
	}
});

export default StoreSelectList;
