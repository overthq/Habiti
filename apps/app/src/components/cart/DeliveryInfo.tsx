import { Spacer, Typography } from '@market/components';
import React from 'react';
import { View } from 'react-native';

const DeliveryInfo = () => {
	return (
		<View style={{ paddingHorizontal: 16 }}>
			<Typography weight='medium' variant='secondary'>
				Delivery Address
			</Typography>
			<Spacer y={4} />
			<Typography>There are no delivery addresses set up.</Typography>
		</View>
	);
};

export default DeliveryInfo;
