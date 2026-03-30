import { Icon, useTheme } from '@habiti/components';
import React from 'react';
import { Pressable } from 'react-native';

import {
	useFollowStoreMutation,
	useUnfollowStoreMutation
} from '../../data/mutations';
import { palette } from '@habiti/components/src/styles/theme';

interface FollowButtonProps {
	storeId: string;
	followed: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ storeId, followed }) => {
	const followStore = useFollowStoreMutation(storeId);
	const unfollowStore = useUnfollowStoreMutation(storeId);
	const { theme } = useTheme();

	const handlePress = React.useCallback(async () => {
		if (followed) {
			unfollowStore.mutate();
		} else {
			followStore.mutate();
		}
	}, [followed]);

	return (
		<Pressable onPress={handlePress}>
			<Icon
				size={22}
				name='heart'
				fill={followed ? palette.red.r500 : undefined}
				color={followed ? palette.red.r500 : undefined}
			/>
		</Pressable>
	);
};

export default FollowButton;
