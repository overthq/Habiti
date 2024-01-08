import React from 'react';
import { View } from 'react-native';
import Typography from '../global/Typography';

const SortProducts = () => {
	return (
		<View>
			<Typography>Default</Typography>
			<Typography>Newest</Typography>
			<Typography>Highest to lowest price</Typography>
			<Typography>Lowest to highest price</Typography>
		</View>
	);
};

export default SortProducts;
