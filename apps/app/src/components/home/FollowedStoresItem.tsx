import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { StoresFollowedQuery } from '../../types/api';

interface FollowedStoresItemProps {
	store: StoresFollowedQuery['currentUser']['followed'][-1]['store'];
	onPress(): void;
}

const FollowedStoresItem: React.FC<FollowedStoresItemProps> = ({
	store,
	onPress
}) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<CustomImage
				uri={store.image?.path}
				height={70}
				width={70}
				style={styles.image}
			/>
			<Typography style={styles.name}>{store.name}</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
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
