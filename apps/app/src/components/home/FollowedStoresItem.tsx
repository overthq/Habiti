import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Avatar, Typography } from '@habiti/components';

import type { Store } from '../../data/types';

interface FollowedStoresItemProps {
	store: Store;
	onPress(): void;
}

const FollowedStoresItem: React.FC<FollowedStoresItemProps> = ({
	store,
	onPress
}) => (
	<Pressable style={styles.container} onPress={onPress}>
		<Avatar
			uri={store.image?.path}
			size={68}
			fallbackText={store.name}
			style={styles.image}
		/>
		<Typography size='small' weight='medium' style={styles.name}>
			{store.name}
		</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		marginRight: 16
	},
	image: {
		borderRadius: 35
	},
	name: {
		textAlign: 'center',
		marginTop: 4
	}
});

export default FollowedStoresItem;
