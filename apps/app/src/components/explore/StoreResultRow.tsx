import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Row, Spacer, Typography } from '@habiti/components';

import { Store } from '../../data/types';

interface StoreResultRowProps {
	store: Store;
	onPress(): void;
}

const StoreResultRow: React.FC<StoreResultRowProps> = ({ store, onPress }) => {
	return (
		<Row onPress={onPress} style={styles.container}>
			<Avatar
				uri={store.image?.path}
				circle
				size={44}
				fallbackText={store.name}
			/>
			<Spacer x={8} />
			<Typography>{store.name}</Typography>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 8,
		paddingHorizontal: 16,
		alignItems: 'center'
	}
});

export default StoreResultRow;
