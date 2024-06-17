import { Screen } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import useGoBack from '../hooks/useGoBack';

const DeliveryAddress = () => {
	useGoBack();

	return (
		<Screen>
			<View />
		</Screen>
	);
};

export default DeliveryAddress;
