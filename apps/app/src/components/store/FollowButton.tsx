import { Icon, Typography, useTheme } from '@market/components';
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
			<Icon size={18} style={styles.icon} name={followed ? 'check' : 'plus'} />
			<Typography weight='medium' style={{ marginLeft: 4 }}>
				{followed ? 'Following' : 'Follow'}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4,
		paddingHorizontal: 16,
		marginTop: 8,
		marginLeft: 8,
		borderWidth: 1,
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center'
	},
	icon: {
		marginRight: 4
	}
});

export default FollowButton;
