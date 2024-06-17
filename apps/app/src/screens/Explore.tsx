import { Screen } from '@habiti/components';
import React from 'react';

import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreMain from '../components/explore/ExploreMain';
import SearchResults from '../components/explore/SearchResults';

const Explore: React.FC = () => {
	const [searchOpen, setSearchOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState('');

	return (
		<Screen>
			<ExploreHeader
				searchOpen={searchOpen}
				setSearchOpen={setSearchOpen}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<ExploreMain searchOpen={searchOpen} />
			<SearchResults searchTerm={searchTerm} searchOpen={searchOpen} />
		</Screen>
	);
};

export default Explore;
