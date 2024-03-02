import { Icon, Typography } from '@market/components';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import {
	useFollowStoreMutation,
	useUnfollowStoreMutation
} from '../../types/api';

interface FollowButtonProps {
	storeId: string;
	followed: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ storeId, followed }) => {
	const [, followStore] = useFollowStoreMutation();
	const [, unfollowStore] = useUnfollowStoreMutation();

	const handlePress = React.useCallback(async () => {
		if (followed) {
			await unfollowStore({ storeId });
		} else {
			await followStore({ storeId });
		}
	}, [followed]);

	return (
		<Pressable style={styles.container} onPress={handlePress}>
			<Icon size={18} style={styles.icon} name={followed ? 'check' : 'plus'} />
			<Typography weight='medium'>
				{followed ? 'Following' : 'Follow'}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingVertical: 4,
		marginLeft: 8,
		borderWidth: 1,
		borderColor: '#D3D3D3',
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		marginRight: 4
	}
});

export default FollowButton;
