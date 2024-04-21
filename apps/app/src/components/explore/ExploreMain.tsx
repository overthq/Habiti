import { Dialog, ScrollableScreen, useTheme } from '@market/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface ExloreMainProps {
	searchOpen: boolean;
}

const ExploreMain: React.FC<ExloreMainProps> = ({ searchOpen }) => {
	const { theme } = useTheme();

	return (
		<ScrollableScreen
			style={[
				styles.container,
				{
					display: searchOpen ? 'none' : 'flex',
					borderTopColor: theme.border.color
				}
			]}
		>
			<Dialog
				style={styles.dialog}
				title='No followed stores'
				description='Discover and follow more stores to improve your experience on the app.'
			/>
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 0.5,
		paddingTop: 12
	},
	dialog: {
		marginHorizontal: 16
	}
});

export default ExploreMain;
