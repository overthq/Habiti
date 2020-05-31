import React from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Linking,
	Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
	useStoreQuery,
	useStoreItemsQuery,
	useFollowStoreMutation,
	useUnfollowStoreMutation,
	useCurrentUserQuery
} from '../types';
import { Icon } from '../components/icons';

const StoreItems: React.FC<{ storeId?: string; header: React.FC }> = ({
	storeId,
	header
}) => {
	const [{ data }] = useStoreItemsQuery({
		variables: { storeId: storeId as string }
	});
	const { navigate } = useNavigation();

	// Loading state with react-native-skeleton-content.

	return (
		<FlatList
			data={data?.storeItems}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={header}
			renderItem={({ item }) => (
				<View style={{ flex: 1, flexDirection: 'column' }}>
					<TouchableOpacity
						key={item.id}
						style={{ flex: 1, margin: 10 }}
						onPress={() => navigate('Item', { itemId: item.id })}
						activeOpacity={0.8}
					>
						<View style={styles.itemImage} />
						<Text style={styles.itemName}>{item.name}</Text>
						<Text style={{ color: '#505050', fontSize: 15 }}>
							${item.price_per_unit}
						</Text>
					</TouchableOpacity>
				</View>
			)}
			numColumns={2}
		/>
	);
};

const Store = () => {
	const { setOptions } = useNavigation();
	const { params } = useRoute();
	const [{ data: currentUserData }] = useCurrentUserQuery();
	const [{ data }, refetch] = useStoreQuery({
		variables: { storeId: params?.storeId }
	});
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();

	React.useLayoutEffect(() => {
		setOptions({ title: data?.store.name });
	}, [data]);

	const handleLinkOpen = async (link?: string | null) => {
		if (link) {
			const supported = await Linking.canOpenURL(link);
			if (supported) await Linking.openURL(link);
		}
	};

	const userInStoreFollowing = data?.store.profile.followers.findIndex(
		({ user_id }) => user_id === currentUserData?.currentUser.id
	);
	const isFollowingStore =
		userInStoreFollowing !== undefined && userInStoreFollowing > -1;

	return (
		<View style={styles.container}>
			<StoreItems
				storeId={data?.store.id}
				header={() => (
					<View style={styles.headerContainer}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							<View
								style={{
									backgroundColor: '#D3D3D3',
									width: 100,
									height: 100,
									borderRadius: 50,
									overflow: 'hidden'
								}}
							>
								<Image
									source={{
										uri: `https://twitter.com/${data?.store.profile.twitter_username}/profile_image?size=original`
									}}
									style={{ width: '100%', height: '100%' }}
								/>
							</View>
							<View style={{ flexDirection: 'row' }}>
								{data?.store.profile.twitter_username && (
									<TouchableOpacity
										style={{ marginRight: 20 }}
										activeOpacity={0.8}
										onPress={() =>
											handleLinkOpen(
												`https://twitter.com/${data.store.profile.twitter_username}`
											)
										}
									>
										<Icon name='twitter' />
									</TouchableOpacity>
								)}
								{data?.store.profile.instagram_username && (
									<TouchableOpacity
										style={{ marginRight: 20 }}
										activeOpacity={0.8}
										onPress={() =>
											handleLinkOpen(
												`https://instagram.com/${data.store.profile.instagram_username}`
											)
										}
									>
										<Icon name='instagram' />
									</TouchableOpacity>
								)}
							</View>
						</View>
						<View>
							<Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
								{data?.store.name}
							</Text>
							{data?.store.profile.website_url && (
								<TouchableOpacity
									style={{ marginTop: 5 }}
									onPress={() => handleLinkOpen(data.store.profile.website_url)}
								>
									<Text style={{ fontSize: 16, color: '#202020' }}>
										{data.store.profile.website_url}
									</Text>
								</TouchableOpacity>
							)}
						</View>
						<TouchableOpacity
							style={styles.followButton}
							activeOpacity={0.8}
							onPress={() => {
								if (data?.store.id) {
									if (isFollowingStore) {
										unfollowStore({ storeId: data.store.id });
									} else {
										followStore({ storeId: data.store.id });
									}
									refetch();
								}
							}}
						>
							<View style={{ marginRight: 5 }}>
								<Icon size={20} name={isFollowingStore ? 'check' : 'plus'} />
							</View>
							<Text style={{ fontSize: 16, fontWeight: '500' }}>
								{isFollowingStore ? 'Following' : 'Follow'}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 10
	},
	itemImage: {
		backgroundColor: '#D3D3D3',
		borderRadius: 8,
		marginBottom: 10,
		width: '100%',
		height: 250
	},
	itemName: {
		fontSize: 16,
		fontWeight: '500'
	},
	followButton: {
		marginTop: 10,
		width: '100%',
		height: 35,
		borderWidth: 1,
		borderColor: '#D3D3D3',
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerContainer: {
		paddingVertical: 25,
		paddingHorizontal: 10
	}
});

export default Store;
