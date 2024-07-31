import { ScrollableScreen, useTheme } from '@habiti/components';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { useHomeQuery } from '../../types/api';
import FollowedStores from '../home/FollowedStores';

interface ExloreMainProps {
	searchOpen: boolean;
}

const ExploreMain: React.FC<ExloreMainProps> = ({ searchOpen }) => {
	const { theme } = useTheme();
	const [{ fetching, data }] = useHomeQuery();

	if (fetching || !data) {
		return <ActivityIndicator />;
	}

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
			<FollowedStores followed={data.currentUser.followed} />
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 0.5,
		paddingTop: 12
	}
});

export default ExploreMain;
