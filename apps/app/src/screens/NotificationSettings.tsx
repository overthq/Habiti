import { Screen, SelectGroup, Spacer, Typography } from '@market/components';
import React from 'react';

import useGoBack from '../hooks/useGoBack';

const NotificationSettings = () => {
	useGoBack();

	return (
		<Screen style={{ padding: 16 }}>
			<Typography weight='medium'>Push notifications</Typography>
			<Spacer y={8} />
			<SelectGroup
				selected='all'
				options={[
					{ title: 'All', value: 'all' },
					{ title: 'Grouped', value: 'grouped' },
					{ title: 'None', value: 'none' }
				]}
			/>
			<Spacer y={16} />
			<Typography weight='medium'>In-app notifications</Typography>
		</Screen>
	);
};

export default NotificationSettings;
