import React from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	StyleSheet,
	Pressable
} from 'react-native';
import { openLink } from '../../utils/links';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation,
	StoreQuery
} from '../../types/api';
import FollowButton from './FollowButton';
import SocialLinks from './SocialLinks';
import { useAppSelector } from '../../redux/store';
import { Icon } from '../icons';
import { useNavigation } from '@react-navigation/native';

interface StoreHeaderProps {
	store: StoreQuery['store'];
}

const StoreHeader: React.FC<StoreHeaderProps> = ({ store }) => {
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();
	const { goBack } = useNavigation();
	const userId = useAppSelector(({ auth }) => auth.userId);

	const isFollowingStore = React.useMemo(() => {
		const userInStoreFollowing = store?.followers?.findIndex(
			({ follower }) => follower.id === userId
		);

		if (userInStoreFollowing) return userInStoreFollowing > -1;
		return false;
	}, [store]);

	return (
		<View style={styles.container}>
			<View style={styles.bar}>
				<Pressable onPress={goBack}>
					<Icon name='chevronLeft' size={28} />
				</Pressable>
			</View>
			<View style={styles.row}>
				<View style={styles.imagePlaceholder}>
					<Image source={{ uri: '' }} style={styles.image} />
				</View>
				<View>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.storeName}>{store?.name}</Text>
						<SocialLinks
							links={[
								{ type: 'twitter', value: store?.twitter_username },
								{ type: 'instagram', value: store?.instagram_username }
							]}
						/>
					</View>
					<TouchableOpacity
						style={{ marginTop: 4 }}
						onPress={() => openLink(store?.website_url)}
					>
						<Text style={styles.websiteLinkText}>{store?.website_url}</Text>
					</TouchableOpacity>
					<FollowButton
						isFollowing={isFollowingStore}
						follow={() => {
							followStore({ storeId: store?.id });
						}}
						unfollow={() => {
							unfollowStore({ storeId: store?.id });
						}}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingBottom: 8
	},
	bar: {
		width: '100%',
		flexDirection: 'row',
		marginVertical: 8,
		marginHorizontal: -8
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
		fontWeight: 'bold'
	},
	websiteLinkText: {
		fontSize: 16,
		color: '#202020'
	}
});

export default StoreHeader;
