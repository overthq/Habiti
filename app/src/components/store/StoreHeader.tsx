import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { openLink } from '../../utils/links';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation,
	StoreQuery
} from '../../types/api';
import FollowButton from './FollowButton';
import SocialLinks from './SocialLinks';
import { useAppSelector } from '../../redux/store';

interface StoreHeaderProps {
	store: StoreQuery['stores_by_pk'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();
	const userId = useAppSelector(({ auth }) => auth.userId);

	const isFollowingStore = React.useMemo(() => {
		const userInStoreFollowing = store?.store_followers?.findIndex(
			({ user_id }) => user_id === userId
		);

		if (userInStoreFollowing) return userInStoreFollowing > -1;
		return false;
	}, [store]);

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<View style={styles.imagePlaceholder}>
					<Image
						source={{ uri: '' /* Do something here */ }}
						style={styles.image}
					/>
				</View>
				<SocialLinks
					links={[
						{
							iconName: 'twitter',
							url: `https://twitter.com/${store?.twitter_username}`
						},
						{
							iconName: 'instagram',
							url: `https://instagram.com/${store?.instagram_username}`
						}
					]}
				/>
			</View>
			<View>
				<Text style={styles.storeName}>{store?.name}</Text>
				<TouchableOpacity
					style={{ marginTop: 5 }}
					onPress={() => openLink(store?.website_url)}
				>
					<Text style={styles.websiteLinkText}>{store?.website_url}</Text>
				</TouchableOpacity>
			</View>
			<FollowButton
				isFollowing={isFollowingStore}
				follow={() => {
					followStore({ storeId: store?.id, userId });
				}}
				unfollow={() => {
					unfollowStore({ storeId: store?.id, userId });
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 25,
		paddingHorizontal: 10
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	imagePlaceholder: {
		backgroundColor: '#D3D3D3',
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: 'hidden',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	storeName: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 10
	},
	websiteLinkText: {
		fontSize: 16,
		color: '#202020'
	}
});

export default StoreHeader;
