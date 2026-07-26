import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import {
	Avatar,
	Icon,
	Screen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';

import useStore from '../state';
import { useManagedStoresQuery } from '../data/queries';
import { switchStore } from '../data/requests';
import { Store } from '../data/types';
import type { AppStackScreenProps } from '../navigation/types';
import { STORE_CREATION_ENABLED } from '../utils/constants';

const StoreSelect: React.FC<AppStackScreenProps<'StoreSelect'>> = ({
	navigation
}) => {
	const { isLoading, data } = useManagedStoresQuery();

	const handleAddStore = React.useCallback(() => {
		navigation.navigate('Modal.CreateStore');
	}, [navigation]);

	if (isLoading || !data) {
		return <View />;
	}

	const hasStores = data.stores.length > 0;

	if (!STORE_CREATION_ENABLED && !hasStores) {
		return (
			<Screen>
				<SafeAreaView style={{ flex: 1 }}>
					<Typography size='xxlarge' weight='bold'>
						No stores
					</Typography>

					<Spacer y={2} />

					<Typography variant='secondary'>
						You do not have access to any stores.
					</Typography>
				</SafeAreaView>
			</Screen>
		);
	}

	return (
		<Screen>
			<SafeAreaView style={{ flex: 1 }}>
				<Typography size='xxlarge' weight='bold'>
					{hasStores ? 'Select store' : 'Create a new store'}
				</Typography>

				<Spacer y={2} />

				<Typography variant='secondary'>
					{hasStores
						? 'Select the store you want to manage.'
						: 'Enter the details of your store to get started.'}
				</Typography>

				<Spacer y={16} />

				<StoreSelectList
					stores={data.stores}
					onAddStore={STORE_CREATION_ENABLED ? handleAddStore : undefined}
				/>
			</SafeAreaView>
		</Screen>
	);
};

interface StoreSelectListProps {
	stores: Store[];
	onAddStore?: () => void;
}

const StoreSelectList: React.FC<StoreSelectListProps> = ({
	stores,
	onAddStore
}) => {
	const { setPreference, activeStore, logIn } = useStore(
		useShallow(state => ({
			setPreference: state.setPreference,
			activeStore: state.activeStore,
			logIn: state.logIn
		}))
	);

	const handleStoreSelect = React.useCallback(
		(storeId: string) => async () => {
			try {
				const { accessToken } = await switchStore(storeId);
				logIn(accessToken);
				setPreference({ activeStore: storeId });
			} catch {
				// TODO: Handle error (show toast, etc.)
			}
		},
		[logIn, setPreference]
	);

	return (
		<View style={{ flex: 1, gap: 12 }}>
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 12 }}>
				{stores.map(store => (
					<StoreSelectListItem
						key={store.id}
						store={store}
						onPress={handleStoreSelect(store.id)}
						selected={store.id === activeStore}
					/>
				))}
				{onAddStore && <CreateStoreButton onPress={onAddStore} />}
			</ScrollView>
		</View>
	);
};

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
				itemStyles.container,
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
			<View
				style={[listStyles.add, { backgroundColor: theme.image.placeholder }]}
			>
				<Icon name='plus' size={24} />
			</View>
			<Spacer x={12} />
			<Typography size='large' style={{ textAlign: 'center' }}>
				Create a new store
			</Typography>
		</Pressable>
	);
};

const itemStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

const listStyles = StyleSheet.create({
	add: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 56,
		height: 56,
		borderRadius: 50
	}
});

export default StoreSelect;
