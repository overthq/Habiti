import { Typography } from '@market/components';
import React from 'react';
import { View } from 'react-native';

import { OrderQuery } from '../../types/api';

interface StoreMetaProps {
	store: OrderQuery['order']['store'];
}

const StoreMeta: React.FC<StoreMetaProps> = ({ store }) => {
	return (
		<View style={{ padding: 16 }}>
			<Typography>{store.name}</Typography>
		</View>
	);
};

export default StoreMeta;
