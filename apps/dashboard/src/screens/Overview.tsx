import { ScrollableScreen } from '@habiti/components';
import React from 'react';

import LowStockProducts from '../components/overview/LowStockProducts';
import ManagePayouts from '../components/overview/ManagePayouts';

const Overview: React.FC = () => {
	return (
		<ScrollableScreen>
			<ManagePayouts />
			<LowStockProducts />
		</ScrollableScreen>
	);
};

export default Overview;
