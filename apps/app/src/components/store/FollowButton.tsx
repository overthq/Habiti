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
				// styles.container,
				{
					// backgroundColor: theme.input.background,
					borderColor: theme.border.color
				}
			]}
			onPress={handlePress}
		>
			<Icon size={20} name='heart' filled={followed} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 32,
		width: 32,
		borderRadius: 100,
		// flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// gap: 4,
		borderWidth: 1
	}
});

export default FollowButton;
