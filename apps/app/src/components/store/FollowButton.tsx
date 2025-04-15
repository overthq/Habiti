import { Icon, Typography, useTheme } from '@habiti/components';
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
	const { theme } = useTheme();

	const handlePress = React.useCallback(async () => {
		if (followed) {
			await unfollowStore({ storeId });
		} else {
			await followStore({ storeId });
		}
	}, [followed]);

	return (
		<Pressable
			style={[
				styles.container,
				{
					backgroundColor: theme.input.background,
					borderColor: theme.border.color
				}
			]}
			onPress={handlePress}
		>
			<Icon size={16} style={styles.icon} name={followed ? 'check' : 'plus'} />
			<Typography size='small' weight='medium'>
				{followed ? 'Following' : 'Follow'}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4,
		paddingLeft: 8,
		paddingRight: 10,
		borderRadius: 100,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		marginRight: 4
	}
});

export default FollowButton;
