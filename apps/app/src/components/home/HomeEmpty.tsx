import React from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Spacer, Typography, useTheme } from '@habiti/components';

const HomeEmpty = () => {
	const { theme } = useTheme();

	return (
		<Animated.View
			style={{ flex: 1, backgroundColor: theme.screen.background, padding: 16 }}
			layout={LinearTransition}
		>
			<Typography weight='medium' size='xxlarge' variant='secondary'>
				Welcome to Habiti
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>
				You can get started by searching for stores or products above.
			</Typography>
		</Animated.View>
	);
};

export default HomeEmpty;
