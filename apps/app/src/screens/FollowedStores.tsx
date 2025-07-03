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

import {
	StoresFollowedQuery,
	useUnfollowStoreMutation,
	useStoresFollowedQuery
} from '../types/api';
import { HomeStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import useRefresh from '../hooks/useRefresh';

const FollowedStores = () => {
	const { theme } = useTheme();
	const [{ data, fetching }, refetch] = useStoresFollowedQuery();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
	useGoBack();

	const handleStoreItemPress = (storeId: string) => () => {
		navigate('Home.Store', { storeId });
	};

	if (fetching && !data) {
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
				data={data.currentUser.followed}
				renderItem={({ item }) => (
					<FollowedStoreItem
						store={item.store}
						onPress={handleStoreItemPress(item.store.id)}
					/>
				)}
				keyExtractor={f => f.storeId}
			/>
		</Screen>
	);
};

interface FollowedStoreItemProps {
	store: StoresFollowedQuery['currentUser']['followed'][number]['store'];
	onPress(): void;
}

const FollowedStoreItem: React.FC<FollowedStoreItemProps> = ({
	store,
	onPress
}) => {
	const { theme } = useTheme();
	const [, unfollowStore] = useUnfollowStoreMutation();

	const handleFollowPress = async () => {
		await unfollowStore({ storeId: store.id });
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
