import { Button, Screen, TextButton, Typography } from '@market/components';
import React from 'react';

const OnboardingPushNotifications = () => {
	const requestPushPermission = () => {};

	return (
		<Screen>
			<Typography>Turn on push notifications</Typography>
			<Button text='Turn on' onPress={requestPushPermission} />
			<TextButton>Turn on later</TextButton>
		</Screen>
	);
};

export default OnboardingPushNotifications;
