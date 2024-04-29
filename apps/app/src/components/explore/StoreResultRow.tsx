import { CustomImage, Spacer, Typography } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { SearchQuery } from '../../types/api';

interface StoreResultRowProps {
	store: SearchQuery['stores'][number];
	onPress(): void;
}

const StoreResultRow: React.FC<StoreResultRowProps> = ({ store, onPress }) => {
	return (
		<Pressable onPress={onPress} style={styles.container}>
			<CustomImage uri={store.image?.path} circle height={44} width={44} />
			<Spacer x={8} />
			<Typography>{store.name}</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		padding: 8,
		alignItems: 'center'
	}
});

export default StoreResultRow;
