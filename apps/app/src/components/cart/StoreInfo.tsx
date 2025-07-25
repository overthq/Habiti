import { Typography } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import { CartQuery } from '../../types/api';

interface StoreInfoProps {
	store: CartQuery['cart']['store'];
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
