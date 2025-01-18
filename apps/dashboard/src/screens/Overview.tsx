import { Screen, ScreenHeader, ScrollableScreen } from '@habiti/components';
import React from 'react';

import LowStockProducts from '../components/overview/LowStockProducts';
import ManagePayouts from '../components/overview/ManagePayouts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Overview: React.FC = () => {
	const { top } = useSafeAreaInsets();

	return (
		<Screen style={{ paddingTop: top }}>
			<ScreenHeader title='Overview' />
			<ScrollableScreen>
				<ManagePayouts />
				<LowStockProducts />
			</ScrollableScreen>
		</Screen>
	);
};

export default Overview;
