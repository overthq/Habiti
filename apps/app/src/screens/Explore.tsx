import { Screen } from '@market/components';
import React from 'react';

import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreMain from '../components/explore/ExploreMain';

const Explore: React.FC = () => {
	const [searchOpen, setSearchOpen] = React.useState(false);

	return (
		<Screen>
			<ExploreHeader searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
			<ExploreMain searchOpen={searchOpen} />
		</Screen>
	);
};

export default Explore;
