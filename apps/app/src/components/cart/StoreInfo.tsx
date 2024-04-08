import { Typography } from '@market/components';
import React from 'react';
import { View } from 'react-native';

import { CartQuery } from '../../types/api';

interface StoreInfoProps {
	store: CartQuery['cart']['store'];
}

// TODO: Allow navigation to store screen from here too
const StoreInfo: React.FC<StoreInfoProps> = ({ store }) => {
	return (
		<View style={{ paddingLeft: 16, paddingBottom: 8 }}>
			<Typography size='xxlarge' weight='bold'>
				{store.name}
			</Typography>
		</View>
	);
};

export default StoreInfo;
