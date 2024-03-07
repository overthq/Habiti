import { Screen, Typography, useTheme } from '@market/components';
import React from 'react';
import { StyleSheet } from 'react-native';

// Where do we want to store recent searches?
// There is a strong case for putting it on the server,
// but storing it locally could also be cool.
interface RecentSearchesProps {
	display: boolean;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ display }) => {
	const { theme } = useTheme();

	return (
		<Screen
			style={[
				styles.container,
				{
					display: display ? 'flex' : 'none',
					borderTopColor: theme.border.color
				}
			]}
		>
			<Typography weight='medium' variant='label' style={styles.header}>
				Recent searches
			</Typography>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 12,
		borderTopWidth: 0.5
	},
	header: {
		marginLeft: 16,
		marginVertical: 8
	}
});

export default RecentSearches;
