import { Screen, SectionHeader, useTheme } from '@habiti/components';
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
			<SectionHeader title='Recent searches' />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 0.5,
		paddingTop: 12
	},
	header: {
		marginLeft: 16,
		marginBottom: 8
	}
});

export default RecentSearches;
