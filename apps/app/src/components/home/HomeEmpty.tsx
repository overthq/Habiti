import React from 'react';
import { Spacer, Typography, useTheme } from '@habiti/components';
import { View } from 'react-native';

const HomeEmpty = () => {
	const { theme } = useTheme();

	return (
		<View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
			<View
				style={{
					borderRadius: 8,
					backgroundColor: theme.modal.background,
					padding: 16
				}}
			>
				<Typography weight='medium' size='xlarge'>
					Welcome to Habiti
				</Typography>
				<Spacer y={4} />
				<Typography variant='secondary'>
					You can get started by searching for stores or products above.
				</Typography>
			</View>
		</View>
	);
};

export default HomeEmpty;
