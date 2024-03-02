import { ScrollableScreen } from '@market/components';
import React from 'react';

import TrendingStores from '../components/explore/TrendingStores';

const Explore: React.FC = () => {
	return (
		<ScrollableScreen keyboardShouldPersistTaps='handled'>
			<TrendingStores />
		</ScrollableScreen>
	);
};

export default Explore;
