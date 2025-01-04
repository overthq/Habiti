import { Screen } from '@habiti/components';
import React from 'react';

import ExploreHeader from '../components/explore/ExploreHeader';
import SearchResults from '../components/explore/SearchResults';

const Explore: React.FC = () => {
	const [searchTerm, setSearchTerm] = React.useState('');

	return (
		<Screen>
			<ExploreHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			<SearchResults searchTerm={searchTerm} />
		</Screen>
	);
};

export default Explore;
