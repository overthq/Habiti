import { Typography, useTheme } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Where do we want to store recent searches?
// There is a strong case for putting it on the server,
// but storing it locally could also be cool.

const RecentSearches = () => {
	const { theme } = useTheme();

	return (
		<View style={{ borderTopColor: theme.border.color }}>
			<Typography weight='medium' variant='label' style={styles.header}>
				Recent searches
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		borderTopWidth: 0.5
	},
	header: {
		marginLeft: 16,
		marginVertical: 8
	}
});

export default RecentSearches;
