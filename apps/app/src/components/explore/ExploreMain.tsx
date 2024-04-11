import {
	Button,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@market/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import TrendingStores from './TrendingStores';

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
			<TrendingStores />
			<View style={{ padding: 16 }}>
				<View
					style={{
						backgroundColor: theme.input.background,
						borderRadius: 6,
						padding: 16
					}}
				>
					<Typography
						size='xlarge'
						weight='medium'
						style={{ textAlign: 'center' }}
					>
						Discover stores
					</Typography>
					<Spacer y={4} />
					<Typography variant='secondary' style={{ textAlign: 'center' }}>
						Follow more stores to get the most out of Market.
					</Typography>
					<Spacer y={8} />
					<Button text='Find stores' />
				</View>
			</View>
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
