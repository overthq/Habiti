import { Screen, SelectGroup, Spacer, Typography } from '@habiti/components';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import useGoBack from '../hooks/useGoBack';

interface NotificationSettingsFormValues {
	cadence: 'all' | 'grouped' | 'none';
}

const NotificationSettings = () => {
	useGoBack();
	const formMethods = useForm<NotificationSettingsFormValues>({
		defaultValues: {
			cadence: 'all'
		}
	});

	return (
		<Screen style={{ padding: 16 }}>
			<Typography weight='medium'>Push notifications</Typography>
			<Spacer y={8} />
			<Controller
				name='cadence'
				control={formMethods.control}
				render={({ field }) => (
					<SelectGroup
						onSelect={value => field.onChange(value)}
						selected={field.value}
						options={[
							{ title: 'All', value: 'all' },
							{ title: 'Grouped', value: 'grouped' },
							{ title: 'None', value: 'none' }
						]}
					/>
				)}
			/>

			<Spacer y={16} />
			<Typography weight='medium'>In-app notifications</Typography>
		</Screen>
	);
};

export default NotificationSettings;
