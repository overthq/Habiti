import { Typography } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import type { Store } from '../../data/types';

interface StoreInfoProps {
	store: Store;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
	return (
		<View style={{ paddingLeft: 16 }}>
			<Typography size='xlarge' weight='semibold'>
				{store.name}
			</Typography>
		</View>
	);
};

export default StoreInfo;
