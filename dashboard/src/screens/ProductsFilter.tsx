import React from 'react';
import Screen from '../components/global/Screen';
import Typography from '../components/global/Typography';
import { StyleSheet } from 'react-native';
import Button from '../components/global/Button';
import useGoBack from '../hooks/useGoBack';
import { useNavigation } from '@react-navigation/native';

// Filter options
// Sort by: price, rating, category, in stock
// Use simple expandable rows

// Rename to "FilterProducts"

const ProductsFilter = () => {
	// TODO: Persist state to Zustand
	const { goBack } = useNavigation();
	useGoBack('x');

	const handleClearFilters = React.useCallback(() => {
		// TODO: Clear
	}, []);

	const handleApply = React.useCallback(() => {
		// TODO: Set latest changes
		goBack();
	}, []);

	return (
		<Screen style={styles.container}>
			<Typography>Price</Typography>
			<Typography>Rating</Typography>
			<Typography>Category</Typography>
			<Typography>In Stock</Typography>
			<Button text='Clear filters' onPress={handleClearFilters} />
			<Button text='Apply' onPress={handleApply} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	}
});

export default ProductsFilter;
