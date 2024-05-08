import { Button, Screen, TextButton, Typography } from '@market/components';
import React from 'react';

const OnboardingPushNotifications = () => {
	return (
		<Screen>
			<Typography>Turn on push notifications</Typography>
			<Button text='Turn on' />
			<TextButton>Maybe later</TextButton>
		</Screen>
	);
};

export default OnboardingPushNotifications;
