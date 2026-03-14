import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';
import { Icon, Spacer, Typography, useTheme } from '@habiti/components';

import StoreSelectListItem from './StoreSelectListItem';
import useStore from '../../state';
import { Store } from '../../data/types';

interface StoreSelectListProps {
	stores: Store[];
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
			style={{ gap: 12 }}
		>
			{stores.map(store => (
				<StoreSelectListItem
					key={store.id}
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
		<Pressable
			style={{
				flexDirection: 'row',
				alignItems: 'center'
			}}
			onPress={onPress}
		>
			<View style={[styles.add, { backgroundColor: theme.image.placeholder }]}>
				<Icon name='plus' size={24} />
			</View>
			<Spacer x={12} />
			<Typography size='large' style={{ textAlign: 'center' }}>
				Create a new store
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	add: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 56,
		height: 56,
		borderRadius: 50
	}
});

export default StoreSelectList;
