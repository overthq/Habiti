import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { openLink } from '../../utils/links';
// import { useFollowStoreMutation, useUnfollowStoreMutation, Stores } from '../../types/api';
import { stores } from '../../api';
import FollowButton from './FollowButton';
import SocialLinks from './SocialLinks';

interface StoreHeaderProps {
	store: typeof stores[-1];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	// const [, followStore] = useFollowStoreMutation();
	// const [, unfollowStore] = useUnfollowStoreMutation();
	// const currentUserData = React.useContext(CurrentUserContext);

	// const userInStoreFollowing = store?.profile.followers.findIndex(
	// 	({ user_id }) => user_id === currentUserData?.currentUser.id
	// );
	// const userInStoreFollowing = false;
	const isFollowingStore = false;
	// const isFollowingStore =
	// 	userInStoreFollowing !== undefined && userInStoreFollowing > -1;

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<View style={styles.imagePlaceholder}>
					<Image source={{ uri: store.avatarUrl }} style={styles.image} />
				</View>
				<SocialLinks
					links={[
						{
							iconName: 'twitter',
							url: `https://twitter.com/${store.links.twitter}`
						},
						{
							iconName: 'instagram',
							url: `https://instagram.com/${store.links.instagram}`
						}
					]}
				/>
			</View>
			<View>
				<Text style={styles.storeName}>{store?.name}</Text>
				<TouchableOpacity
					style={{ marginTop: 5 }}
					onPress={() => openLink(store.links.website)}
				>
					<Text style={styles.websiteLinkText}>{store.links.website}</Text>
				</TouchableOpacity>
			</View>
			<FollowButton
				isFollowing={isFollowingStore}
				follow={() => {
					// followStore({ storeId: store?.id, userId: '' });
				}}
				unfollow={() => {
					// unfollowStore({ storeId: store.id, userId: '' });
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
