import { Screen } from '@market/components';
import React from 'react';

import TrendingStores from './TrendingStores';

interface ExloreMainProps {
	searchOpen: boolean;
}

const ExploreMain: React.FC<ExloreMainProps> = ({ searchOpen }) => {
	return (
		<Screen style={{ display: searchOpen ? 'none' : 'flex' }}>
			<TrendingStores />
		</Screen>
	);
};

export default ExploreMain;
