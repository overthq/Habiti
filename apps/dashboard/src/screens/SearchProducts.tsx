import { Screen } from '@market/components';
import React from 'react';

const SearchProducts = () => {
	const [term, setTerm] = React.useState('');

	const handleSearch = React.useCallback(() => {
		// Do something with term
	}, []);

	return <Screen></Screen>;
};

export default SearchProducts;
