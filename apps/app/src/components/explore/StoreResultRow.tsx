import { CustomImage, Row, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet } from 'react-native';

import { SearchQuery } from '../../types/api';

interface StoreResultRowProps {
	store: SearchQuery['stores'][number];
	onPress(): void;
}

const StoreResultRow: React.FC<StoreResultRowProps> = ({ store, onPress }) => {
	return (
		<Row onPress={onPress} style={styles.container}>
			<CustomImage uri={store.image?.path} circle height={44} width={44} />
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
