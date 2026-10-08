import React from 'react';
import {
	Pressable,
	ScrollView,
	StyleSheet,
	View,
	useWindowDimensions
} from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets
} from 'react-native-safe-area-context';
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
	const { top, bottom } = useSafeAreaInsets();

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
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: top, paddingBottom: bottom + 16 }}
			>
				<View style={styles.header}>
					<Typography size='xxxlarge' weight='bold'>
						{hasStores ? 'Select store' : 'Create a new store'}
					</Typography>

					<Spacer y={2} />

					<Typography variant='secondary'>
						{hasStores
							? `${STORE_CREATION_ENABLED ? 'Select or create a store' : 'Select a store'} to manage. You can always switch between stores later.`
							: 'Enter the details of your store to get started.'}
					</Typography>
				</View>

				<Spacer y={8} />

				<StoreSelectList
					stores={data.stores}
					onAddStore={STORE_CREATION_ENABLED ? handleAddStore : undefined}
				/>
			</ScrollView>
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
	const { width } = useWindowDimensions();

	// Size the cells so that three columns exactly fill the screen's content
	// width. The avatars sit inside each cell's padding.
	const itemSize = Math.floor(
		(width - SCREEN_PADDING * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS
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
		<View style={styles.grid}>
			{stores.map(store => (
				<StoreSelectItem
					key={store.id}
					store={store}
					size={itemSize}
					onPress={handleStoreSelect(store.id)}
					selected={store.id === activeStore}
				/>
			))}
			{onAddStore && <CreateStoreButton size={itemSize} onPress={onAddStore} />}
		</View>
	);
};

const COLUMNS = 3;
const COLUMN_GAP = 4;
const CELL_PADDING = 12;
const SCREEN_PADDING = 16;

interface StoreSelectItemProps {
	size: number;
	selected: boolean;
	store: Store;
	onPress(): void;
}

const StoreSelectItem: React.FC<StoreSelectItemProps> = ({
	size,
	selected,
	onPress,
	store
}) => {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.item,
				{ width: size },
				{ opacity: pressed ? 0.7 : 1 }
			]}
		>
			<Avatar
				uri={store.image?.path}
				fallbackText={store.name}
				size={size - CELL_PADDING * 2}
				circle
			/>
			<Spacer y={8} />
			<Typography
				weight={selected ? 'medium' : undefined}
				numberOfLines={1}
				style={styles.name}
			>
				{store.name}
			</Typography>
		</Pressable>
	);
};

interface CreateStoreButtonProps {
	size: number;
	onPress(): void;
}

const CreateStoreButton: React.FC<CreateStoreButtonProps> = ({
	size,
	onPress
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.item,
				{ width: size },
				{ opacity: pressed ? 0.7 : 1 }
			]}
		>
			<View
				style={[
					styles.add,
					{
						width: size - CELL_PADDING * 2,
						height: size - CELL_PADDING * 2,
						borderRadius: size / 2,
						backgroundColor: theme.image.placeholder
					}
				]}
			>
				<Icon name='plus' size={24} />
			</View>
			<Spacer y={8} />
			<Typography numberOfLines={1} style={styles.name}>
				New store
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	header: {
		paddingVertical: 12
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		columnGap: COLUMN_GAP,
		rowGap: 4
	},
	item: {
		alignItems: 'center',
		padding: CELL_PADDING
	},
	name: {
		textAlign: 'center'
	},
	add: {
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default StoreSelect;
