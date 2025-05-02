import React from 'react';
import { Screen, Spacer, Typography } from '@habiti/components';

const HomeEmpty = () => {
	return (
		<Screen style={{ padding: 16 }}>
			<Typography weight='medium' size='xxlarge' variant='secondary'>
				Welcome to Habiti
			</Typography>
			<Spacer y={4} />
			<Typography variant='secondary'>
				You can get started by searching for stores or products above.
			</Typography>
		</Screen>
	);
};

export default HomeEmpty;
