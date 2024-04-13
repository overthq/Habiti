import { ScrollableScreen, useTheme } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

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
			<View />
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderTopWidth: 0.5
	}
});

export default ExploreMain;
