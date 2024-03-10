import { Screen, Typography } from '@market/components';
import React from 'react';

import useGoBack from '../hooks/useGoBack';

const DeliveryAddress = () => {
	useGoBack();

	return (
		<Screen>
			<Typography>Delivery Address</Typography>
		</Screen>
	);
};

export default DeliveryAddress;
