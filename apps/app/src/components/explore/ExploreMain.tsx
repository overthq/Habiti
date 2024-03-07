import { Screen, useTheme } from '@market/components';
import React from 'react';
import { StyleSheet } from 'react-native';

import TrendingStores from './TrendingStores';

interface ExloreMainProps {
	searchOpen: boolean;
}

const ExploreMain: React.FC<ExloreMainProps> = ({ searchOpen }) => {
	const { theme } = useTheme();
	return (
		<Screen
			style={[
				styles.container,
				{
					display: searchOpen ? 'none' : 'flex',

					borderTopColor: theme.border.color
				}
			]}
		>
			<TrendingStores />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 12,
		borderTopWidth: 0.5
	}
});

export default ExploreMain;
