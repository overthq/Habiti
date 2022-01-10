import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation,
	StoreQuery
} from '../../types/api';
import { useAppSelector } from '../../redux/store';

interface FollowButtonProps {
	store: StoreQuery['store'];
}

const FollowButton: React.FC<FollowButtonProps> = ({ store }) => {
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();
	const userId = useAppSelector(({ auth }) => auth.userId);

	// TODO: We should fetch this information using the userId.
	// Fetching the entire list of followers is not efficient.
	// Actually, we can simply fetch the list of stores the user follows.
	// The only thing is that we have to update the cache manually.

	const isFollowing = React.useMemo(() => {
		const follow = store?.followers?.find(
			({ follower }) => follower.id === userId
		);

		return !!follow;
	}, [store]);

	const handlePress = React.useCallback(async () => {
		if (isFollowing) {
			await unfollowStore({ storeId: store.id });
		} else {
			await followStore({ storeId: store.id });
		}
	}, [isFollowing]);

	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={handlePress}
		>
			<Icon
				size={18}
				style={{ marginRight: 4 }}
				name={isFollowing ? 'check' : 'plus'}
			/>
			<Text style={{ fontSize: 16, fontWeight: '500' }}>
				{isFollowing ? 'Following' : 'Follow'}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 4,
		borderWidth: 1,
		borderColor: '#D3D3D3',
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default FollowButton;
