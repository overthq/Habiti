import { Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Categories = () => {
	return (
		<View style={styles.container}>
			<Typography weight='medium' variant='label'>
				Categories
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 16
	}
});

export default Categories;
