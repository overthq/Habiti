import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../icons';
import { openLink } from '../../utils/links';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation,
	Stores
} from '../../types/api';

interface StoreHeaderProps {
	store?: Stores;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();
	// const currentUserData = React.useContext(CurrentUserContext);

	// const userInStoreFollowing = store?.profile.followers.findIndex(
	// 	({ user_id }) => user_id === currentUserData?.currentUser.id
	// );
	// const userInStoreFollowing = false;
	const isFollowingStore = false;
	// const isFollowingStore =
	// 	userInStoreFollowing !== undefined && userInStoreFollowing > -1;

	return (
		<View style={styles.headerContainer}>
			<View style={styles.headerImagePlaceholder}>
				{/* <Image
					source={{
						uri: `https://twitter.com/${store?.profile.twitter_username}/profile_image?size=original`
					}}
					style={{ width: '100%', height: '100%' }}
				/>*/}
			</View>
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity
					style={{ marginRight: 20 }}
					activeOpacity={0.8}
					onPress={() => openLink(`https://twitter.com/rand`)}
				>
					<Icon name='twitter' />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginRight: 20 }}
					activeOpacity={0.8}
					onPress={() => openLink(`https://instagram.com/rand`)}
				>
					<Icon name='instagram' />
				</TouchableOpacity>
			</View>
			<View>
				<Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
					{store?.name}
				</Text>
				<TouchableOpacity
					style={{ marginTop: 5 }}
					onPress={() => openLink('https://example.com')}
				>
					<Text style={{ fontSize: 16, color: '#202020' }}>
						https://example.com
					</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={styles.followButton}
				activeOpacity={0.8}
				onPress={() => {
					if (store?.id) {
						if (isFollowingStore) {
							unfollowStore({ storeId: store.id, userId: '' });
						} else {
							followStore({ storeId: store?.id, userId: '' });
						}
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
	);
};

const styles = StyleSheet.create({
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
	},
	headerImagePlaceholder: {
		backgroundColor: '#D3D3D3',
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: 'hidden',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default StoreHeader;
