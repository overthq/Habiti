import { CustomImage, Screen, Typography } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { StoresFollowedQuery, useStoresFollowedQuery } from '../types/api';
import { HomeStackParamList } from '../types/navigation';

const FollowedStores = () => {
	const [editMode, setEditMode] = React.useState(false);
	const [selectedStores, setSelectedStores] = React.useState<string[]>([]);
	const [{ data, fetching }] = useStoresFollowedQuery();
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	const handleStoreItemPress = (storeId: string) => () => {
		navigate('Store', { screen: 'Store.Main', params: { storeId } });
	};

	const handleStoreItemLongPress = (storeId: string) => () => {
		// TODO: Handle case where item is already selected.
		setEditMode(true);
		setSelectedStores(s => [...s, storeId]);
	};

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Screen>
			<FlashList
				data={data.currentUser.followed}
				renderItem={({ item }) => (
					<FollowedStoreItem
						store={item.store}
						onPress={handleStoreItemPress(item.store.id)}
						onLongPress={handleStoreItemLongPress(item.store.id)}
						editMode={editMode}
						selected={selectedStores.includes(item.store.id)}
					/>
				)}
				keyExtractor={f => f.id}
			/>
		</Screen>
	);
};

interface FollowedStoreItemProps {
	store: StoresFollowedQuery['currentUser']['followed'][number]['store'];
	onPress(): void;
	onLongPress(): void;
	editMode: boolean;
	selected: boolean;
}

const FollowedStoreItem: React.FC<FollowedStoreItemProps> = ({ store }) => {
	return (
		<Pressable>
			<Animated.View style={styles.item}>
				<CustomImage width={40} height={40} style={styles.image} />
				<Typography>{store.name}</Typography>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	item: {},
	image: {
		borderRadius: 20,
		marginRight: 8
	}
});

export default FollowedStores;
