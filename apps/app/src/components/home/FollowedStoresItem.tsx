import { CustomImage, Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { StoresFollowedQuery } from '../../types/api';

interface FollowedStoresItemProps {
	store: StoresFollowedQuery['currentUser']['followed'][number]['store'];
	onPress(): void;
}

const FollowedStoresItem: React.FC<FollowedStoresItemProps> = ({
	store,
	onPress
}) => (
	<Pressable style={styles.container} onPress={onPress}>
		<CustomImage
			uri={store.image?.path}
			height={68}
			width={68}
			style={styles.image}
		/>
		<Typography size='small' weight='medium' style={styles.name}>
			{store.name}
		</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16
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
