import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import {
	useFollowStoreMutation,
	useUnfollowStoreMutation,
	StoreQuery
} from '../../types/api';

interface FollowButtonProps {
	store: StoreQuery['store'];
}

const FollowButton: React.FC<FollowButtonProps> = ({ store }) => {
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();

	const handlePress = React.useCallback(async () => {
		if (store.followedByUser) {
			await unfollowStore({ storeId: store.id });
		} else {
			await followStore({ storeId: store.id });
		}
	}, [store.followedByUser]);

	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={handlePress}
		>
			<Icon
				size={18}
				style={{ marginRight: 4 }}
				name={store.followedByUser ? 'check' : 'plus'}
			/>
			<Text style={{ fontSize: 16, fontWeight: '500' }}>
				{store.followedByUser ? 'Following' : 'Follow'}
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
