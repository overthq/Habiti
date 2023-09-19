import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useCategoriesQuery } from '../types/api';
import useGoBack from '../hooks/useGoBack';

const Categories = () => {
	const [{ data, fetching }] = useCategoriesQuery();
	useGoBack();

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	if (!data?.currentStore.categories) {
		return (
			<View>
				<Text>No categories</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{data.currentStore.categories.map(category => (
				<Text key={category.id}>{category.name}</Text>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	}
});

export default Categories;
