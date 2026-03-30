import { Avatar, Row, Screen, Typography, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
	ActivityIndicator,
	Pressable,
	RefreshControl,
	StyleSheet,
	View
} from 'react-native';

import { useUnfollowStoreMutation } from '../data/mutations';
import { useStoresFollowedQuery } from '../data/queries';
import type { Store } from '../data/types';
import { HomeStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import useRefresh from '../hooks/useRefresh';

const FollowedStores = () => {
	const { theme } = useTheme();
	const { data, isLoading, refetch } = useStoresFollowedQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	useGoBack();

	const handleStoreItemPress = (storeId: string) => () => {
		navigate('Home.Store', { storeId });
	};

	if (isLoading && !data) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<Screen style={{ paddingTop: 8 }}>
			<FlashList
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						tintColor={theme.text.secondary}
					/>
				}
				data={data.stores}
				renderItem={({ item }) => (
					<FollowedStoreItem
						store={item}
						onPress={handleStoreItemPress(item.id)}
					/>
				)}
				keyExtractor={s => s.id}
			/>
		</Screen>
	);
};

interface FollowedStoreItemProps {
	store: Store;
	onPress(): void;
}

const FollowedStoreItem: React.FC<FollowedStoreItemProps> = ({
	store,
	onPress
}) => {
	const { theme } = useTheme();
	const unfollowStore = useUnfollowStoreMutation(store.id);

	const handleFollowPress = async () => {
		unfollowStore.mutate();
	};

	return (
		<Row onPress={onPress} style={styles.item}>
			<View style={styles.left}>
				<Avatar
					size={40}
					uri={store.image?.path}
					circle
					fallbackText={store.name}
					style={styles.image}
				/>
				<Typography weight='medium'>{store.name}</Typography>
			</View>
			<Pressable
				style={[
					styles.button,
					{ backgroundColor: theme.button.primary.background }
				]}
				onPress={handleFollowPress}
			>
				<Typography
					size='small'
					weight='medium'
					style={{ color: theme.button.primary.text }}
				>
					Unfollow
				</Typography>
			</Pressable>
		</Row>
	);
};

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	image: {
		marginRight: 8
	},
	button: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderWidth: 1,
		borderRadius: 6
	}
});

export default FollowedStores;
