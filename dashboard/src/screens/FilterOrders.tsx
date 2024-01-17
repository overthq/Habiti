import React from 'react';
import Screen from '../components/global/Screen';
import useGoBack from '../hooks/useGoBack';

const FilterOrders = () => {
	useGoBack('x');

	return <Screen></Screen>;
};

export default FilterOrders;
