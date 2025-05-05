import { Icon, useTheme } from '@habiti/components';
import React from 'react';
import { Pressable } from 'react-native';

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
			style={{ borderColor: theme.border.color }}
			onPress={handlePress}
		>
			<Icon size={22} name='heart' filled={followed} />
		</Pressable>
	);
};

export default FollowButton;
