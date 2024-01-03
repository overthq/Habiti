import React from 'react';
import Screen from '../components/global/Screen';

const SearchProducts = () => {
	const [term, setTerm] = React.useState('');

	const handleSearch = React.useCallback(() => {
		// Do something with term
	}, []);

	return <Screen></Screen>;
};

export default SearchProducts;
