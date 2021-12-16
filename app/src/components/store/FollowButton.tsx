import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../icons';
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
	const [disabled, setDisabled] = React.useState(false);
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();
	const userId = useAppSelector(({ auth }) => auth.userId);

	const isFollowing = React.useMemo(() => {
		const follow = store?.followers?.find(
			({ follower }) => follower.id === userId
		);

		return !!follow;
	}, [store]);

	const handlePress = React.useCallback(async () => {
		setDisabled(true);

		if (isFollowing) {
			await unfollowStore({ storeId: store.id });
		} else {
			await followStore({ storeId: store.id });
		}

		setDisabled(false);
	}, [isFollowing]);

	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={handlePress}
			disabled={disabled}
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
		marginTop: 8,
		width: '100%',
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
